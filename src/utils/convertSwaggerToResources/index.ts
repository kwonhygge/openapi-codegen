import SwaggerParser from "@apidevtools/swagger-parser";
import {
  isOpenApiV2,
  isOperationObject,
  isSingleExistingSchema,
} from "../../types/typeGuards";
import path from "path";
import { OUT_DIR, TEMPLATES_DIR } from "../../constants/directories";
import { hbsToFile } from "../common/hbsToFile";
import { ResourceValue } from "../../types";
import { OpenAPIV2 } from "openapi-types";
import { getParametersType } from "./getParametersType";
import { getResponseType } from "./getResponseType";
import { extractSchemaNameByRef } from "./extractSchemaNameByRef";
import { extractSchemaNameFromExistingSchema } from "./extractSchemaNameFromExistingSchema";

function findExistingSchemas(
  operationObj: OpenAPIV2.OperationObject,
): Set<string> {
  const existingSchemas = new Set<string>();

  if (operationObj.parameters) {
    operationObj.parameters.forEach((param) => {
      if ("schema" in param && isSingleExistingSchema(param.schema)) {
        const schemaName = extractSchemaNameByRef(param.schema.$ref);
        if (schemaName) existingSchemas.add(schemaName);
      }
    });
  }

  if (operationObj.responses["200"]) {
    const successResponse = operationObj.responses["200"];

    if (
      "schema" in successResponse &&
      successResponse.schema &&
      isSingleExistingSchema(successResponse.schema)
    ) {
      const schemaName = extractSchemaNameFromExistingSchema(
        successResponse.schema,
      );

      if (schemaName) existingSchemas.add(schemaName);
    }
  }

  return existingSchemas;
}

export async function convertSwaggerToResources(swaggerUrl: string) {
  try {
    const api = await SwaggerParser.bundle(swaggerUrl);

    if (!isOpenApiV2(api)) return;

    const paths = api.paths;
    const existingSchemasSet = new Set<string>();
    const resources: Record<string, ResourceValue> = {};

    for (const [path, pathItem] of Object.entries(paths)) {
      for (const [method, operation] of Object.entries(pathItem)) {
        const operationObj = operation;
        if (!operationObj || !isOperationObject(operationObj)) continue;

        const resourceKey = operationObj.operationId || "noName";

        const parametersType = getParametersType(operationObj.parameters);
        const responseType = getResponseType(operationObj.responses);

        resources[resourceKey] = {
          path,
          method: method.toLowerCase(),
          params: parametersType,
          responseType,
        };

        findExistingSchemas(operationObj).forEach((schema) =>
          existingSchemasSet.add(schema),
        );
      }
    }

    const templatePath = path.join(TEMPLATES_DIR, "resources.hbs");
    const outputPath = path.join(OUT_DIR, "resources.ts");

    await hbsToFile(templatePath, outputPath, {
      resources,
      imports: Array.from(existingSchemasSet),
    });
  } catch (err) {
    console.error("에러 발생:", err);
    throw err;
  }
}
