import { OpenAPIV2 } from "openapi-types";
import { toZodSchema } from "../common/toZodSchema";
import { extractSchemaNameFromExistingSchema } from "./extractSchemaNameFromExistingSchema";
import { isAlreadyExistingSchema } from "../../types/typeGuards";

export function getResponseType(
  responses: OpenAPIV2.ResponsesObject,
): string | null {
  if (!responses["200"]) {
    return null;
  }

  const successResponse = responses["200"];

  if (!("schema" in successResponse) || !successResponse.schema) {
    return null;
  }

  const schema = successResponse.schema;

  return isAlreadyExistingSchema(schema)
    ? extractSchemaNameFromExistingSchema(schema)
    : toZodSchema(schema);
}
