import { OpenAPIV2 } from "openapi-types";
import {
  isParameterObject,
  isAlreadyExistingSchema,
} from "../../types/typeGuards";
import {
  convertParametersToJSONSchema,
  OpenAPIParametersAsJSONSchema,
} from "openapi-jsonschema-parameters";
import { toZodSchema } from "../common/toZodSchema";
import { extractSchemaNameFromExistingSchema } from "./extractSchemaNameFromExistingSchema";

function getZodSchemasFromJson(
  jsonSchema: OpenAPIParametersAsJSONSchema,
): Record<string, any> {
  const zodSchemas: Record<string, any> = {};

  for (const [_, schemaInfo] of Object.entries(jsonSchema)) {
    if (schemaInfo.properties) {
      for (const [propName, propSchema] of Object.entries(
        schemaInfo.properties,
      )) {
        const zodSchema = toZodSchema(propSchema as OpenAPIV2.SchemaObject);

        zodSchemas[propName] = zodSchema;
      }
    }
  }

  return zodSchemas;
}

export function getParametersType(
  parameters: OpenAPIV2.Parameters | undefined,
): Record<string, unknown> {
  const paramGroups: Record<string, OpenAPIV2.ParameterObject[]> = {};
  if (!parameters) return {};

  parameters.forEach((param) => {
    if (!isParameterObject(param)) return;

    const paramType = param.in;

    if (!paramGroups[paramType]) {
      paramGroups[paramType] = [];
    }

    paramGroups[paramType].push(param);
  });

  const parametersType: Record<string, unknown> = {};

  for (const [paramType, params] of Object.entries(paramGroups)) {
    if (paramType === "body") {
      const bodyParam = params[0];
      if (!bodyParam.schema) continue;

      parametersType[paramType] = isAlreadyExistingSchema(bodyParam.schema)
        ? extractSchemaNameFromExistingSchema(bodyParam.schema)
        : toZodSchema(bodyParam.schema);
    } else {
      const jsonSchema = convertParametersToJSONSchema(params);
      parametersType[paramType] = getZodSchemasFromJson(jsonSchema);
    }
  }

  return parametersType;
}
