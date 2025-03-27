import { OpenAPIV2 } from "openapi-types";
import { jsonSchemaToZod } from "json-schema-to-zod";

function removeDescriptions(
  schema: OpenAPIV2.SchemaObject,
): OpenAPIV2.SchemaObject {
  if (Array.isArray(schema)) {
    return schema.map((item) => removeDescriptions(item));
  } else if (typeof schema === "object" && schema !== null) {
    const newObj: OpenAPIV2.SchemaObject = {};

    for (const key in schema) {
      if (key === "description") continue;

      const value = schema[key];
      newObj[key] = removeDescriptions(value);
    }

    return newObj;
  }

  return schema;
}

export function toZodSchema(jsonSchema: OpenAPIV2.SchemaObject): string {
  const schema = removeDescriptions(jsonSchema);
  return jsonSchemaToZod(schema);
}
