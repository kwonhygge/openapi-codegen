import { OpenAPI, OpenAPIV2 } from "openapi-types";
import { ReferenceSchema } from "./index";

export function isOpenApiV2(api: OpenAPI.Document): api is OpenAPIV2.Document {
  return "swagger" in api && api.swagger?.startsWith("2");
}

export function isAlreadyExistingSchema(
  schema: OpenAPIV2.SchemaObject,
): schema is ReferenceSchema {
  return isSingleExistingSchema(schema) || isArrayExistingSchema(schema);
}

export function isSingleExistingSchema(
  schema: OpenAPIV2.SchemaObject,
): schema is OpenAPIV2.ReferenceObject {
  return "$ref" in schema;
}

export function isArrayExistingSchema(
  schema: OpenAPIV2.SchemaObject,
): schema is OpenAPIV2.ItemsObject {
  return "type" in schema && schema.type === "array";
}

export function isOperationObject(obj: any): obj is OpenAPIV2.OperationObject {
  return typeof obj !== "string" && !Array.isArray(obj);
}

export function isParameterObject(obj: any): obj is OpenAPIV2.Parameter {
  return "in" in obj;
}
