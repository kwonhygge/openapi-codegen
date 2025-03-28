import { ReferenceSchema } from "../../types";
import {
  isArrayExistingSchema,
  isSingleExistingSchema,
} from "../../types/typeGuards";
import { extractSchemaNameByRef } from "./extractSchemaNameByRef";

function toArraySchemaName(typeName: string): string {
  return `z.array(${typeName})`;
}

export function extractSchemaNameFromExistingSchema(schema: ReferenceSchema) {
  if (isArrayExistingSchema(schema) && schema.items && schema.items.$ref) {
    const schemaName = extractSchemaNameByRef(schema.items.$ref);
    return toArraySchemaName(schemaName);
  } else if (isSingleExistingSchema(schema) && schema.$ref) {
    return extractSchemaNameByRef(schema.$ref);
  }
  return null;
}
