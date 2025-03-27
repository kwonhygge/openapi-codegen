import { convertParametersToJSONSchema } from "openapi-jsonschema-parameters";
import SwaggerParser from "@apidevtools/swagger-parser";
import { OpenAPIV2 } from "openapi-types";
import path from "path";
import fs from "fs";
import Handlebars from "handlebars";
import prettier from "prettier";
import {
  isArraySchemaObject,
  isOpenApiV2,
  isReferenceObject,
  isReferenceSchema,
} from "../types/typeGuards";
import { ReferenceSchema } from "../types";
import { toZodSchema } from "./common/toZodSchema";
import { OUT_DIR, TEMPLATES_DIR } from "../constants/directories";

type ResourceValue = {
  path: string;
  method: string;
  params: Record<string, unknown>;
  responseType: string | null;
};

function toArrayTypeName(typeName: string): string {
  return `z.array(${typeName})`;
}

function extractSchemaNameByRef(ref: string): string {
  const refParts = ref.split("/");
  return refParts[refParts.length - 1];
}

function getResponseType(responses: OpenAPIV2.ResponsesObject): string | null {
  if (!responses["200"]) {
    return null;
  }

  const successResponse = responses["200"] as OpenAPIV2.ResponseObject;

  if (!successResponse.schema) {
    return null;
  }

  const schema = successResponse.schema;

  return isReferenceSchema(schema)
    ? extractSchemaNameFromReferenceSchema(schema)
    : toZodSchema(schema as OpenAPIV2.SchemaObject);
}

function collectUsedSchemas(
  operationObj: OpenAPIV2.OperationObject,
): Set<string> {
  const usedSchemas = new Set<string>();

  if (operationObj.parameters) {
    operationObj.parameters.forEach((param) => {
      if ("schema" in param && isReferenceObject(param.schema)) {
        const schemaName = extractSchemaNameByRef(param.schema.$ref);
        if (schemaName) usedSchemas.add(schemaName);
      }
    });
  }

  if (operationObj.responses["200"]) {
    const successResponse = operationObj.responses["200"];
    if (
      "schema" in successResponse &&
      successResponse.schema &&
      isReferenceObject(successResponse.schema)
    ) {
      const schemaName = extractSchemaNameFromReferenceSchema(
        successResponse.schema,
      );
      if (schemaName) usedSchemas.add(schemaName);
    }
  }

  return usedSchemas;
}

function extractSchemaNameFromReferenceSchema(schema: ReferenceSchema) {
  if (
    isArraySchemaObject(schema) &&
    schema.items &&
    isReferenceObject(schema.items)
  ) {
    const schemaName = extractSchemaNameByRef(schema.items.$ref);
    return toArrayTypeName(schemaName);
  } else if (isReferenceObject(schema) && schema.$ref) {
    return extractSchemaNameByRef(schema.$ref);
  }
  return null;
}

function convertAllPropertiesToZod(jsonSchema: any): Record<string, any> {
  const zodSchemas: Record<string, any> = {};

  for (const [paramIn, schemaDefinition] of Object.entries(jsonSchema)) {
    const typedSchema = schemaDefinition as {
      properties?: Record<string, any>;
    };

    if (typedSchema.properties) {
      for (const [propName, propSchema] of Object.entries(
        typedSchema.properties,
      )) {
        const zodSchema = toZodSchema(propSchema);

        zodSchemas[propName] = zodSchema;
      }
    }
  }

  return zodSchemas;
}
function parseParameters(
  parameters: OpenAPIV2.ParameterObject[],
): Record<string, unknown> {
  const paramGroups: Record<string, OpenAPIV2.ParameterObject[]> = {};

  parameters.forEach((param) => {
    const paramIn = param.in;
    if (!paramGroups[paramIn]) {
      paramGroups[paramIn] = [];
    }
    paramGroups[paramIn].push(param);
  });

  const parsedParams: Record<string, unknown> = {};

  for (const [paramIn, params] of Object.entries(paramGroups)) {
    const jsonSchema = convertParametersToJSONSchema(params);
    const allZodSchemas = convertAllPropertiesToZod(jsonSchema);

    if (paramIn === "body") {
      const bodyParam = params[0];
      if (!bodyParam.schema) continue;

      parsedParams[paramIn] = isReferenceSchema(bodyParam.schema)
        ? extractSchemaNameFromReferenceSchema(bodyParam.schema)
        : toZodSchema(bodyParam.schema);
    } else {
      parsedParams[paramIn] = allZodSchemas;
    }
  }

  return parsedParams;
}

export async function convertSwaggerToResources(swaggerUrl: string) {
  try {
    const api = await SwaggerParser.bundle(swaggerUrl);

    if (!isOpenApiV2(api)) return;

    const paths = api.paths;

    const resources: Record<string, ResourceValue> = {};

    const allUsedSchemas = new Set<string>();

    for (const [path, pathItem] of Object.entries(paths)) {
      for (const [method, operation] of Object.entries(pathItem)) {
        const operationObj = operation as OpenAPIV2.OperationObject;
        if (!operationObj) continue;

        const resourceKey = operationObj.operationId || "noName";

        const params = operationObj.parameters
          ? parseParameters(
              operationObj.parameters as OpenAPIV2.ParameterObject[],
            )
          : {};

        const responseType = getResponseType(
          operationObj.responses as OpenAPIV2.ResponsesObject,
        );

        const usedSchemas = collectUsedSchemas(operationObj);
        usedSchemas.forEach((schema) => allUsedSchemas.add(schema));

        resources[resourceKey] = {
          path,
          method: method.toLowerCase(),
          params,
          responseType,
        };
      }
    }

    const templatePath = path.join(TEMPLATES_DIR, "resources.hbs");
    const templateSource = fs.readFileSync(templatePath, "utf-8");
    const template = Handlebars.compile(templateSource);

    const result = template({
      resources,
      imports: Array.from(allUsedSchemas),
    });

    const formattedResult = await prettier.format(result, {
      parser: "typescript",
    });

    fs.writeFileSync(path.join(OUT_DIR, "resources.ts"), formattedResult);
  } catch (err) {
    console.error("에러 발생:", err);
    throw err;
  }
}
