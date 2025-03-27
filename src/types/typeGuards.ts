import { OpenAPI, OpenAPIV2 } from "openapi-types";
import { ReferenceSchema } from "./index";

export function isOpenApiV2(api: OpenAPI.Document): api is OpenAPIV2.Document {
  return "swagger" in api && api.swagger?.startsWith("2");
}

export function isReferenceSchema(
  schema: OpenAPIV2.SchemaObject,
): schema is ReferenceSchema {
  return isReferenceObject(schema) || isArraySchemaObject(schema);
}

export function isReferenceObject(
  schema: OpenAPIV2.SchemaObject,
): schema is OpenAPIV2.ReferenceObject {
  return "$ref" in schema;
}

export function isArraySchemaObject(
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
