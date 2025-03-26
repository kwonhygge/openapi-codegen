import SwaggerParser from "@apidevtools/swagger-parser";
import { jsonSchemaToZod } from "json-schema-to-zod";
import Handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { OpenAPIV3, OpenAPIV2, OpenAPI } from "openapi-types";
import prettier from "prettier";

export function removeDescriptions<T>(schema: T): T {
  if (Array.isArray(schema)) {
    return schema.map((item) => removeDescriptions(item)) as T;
  } else if (typeof schema === "object" && schema !== null) {
    const newObj: any = {};

    for (const key in schema) {
      if (key === "description") continue;

      const value = (schema as any)[key];
      newObj[key] = removeDescriptions(value);
    }

    return newObj;
  }

  return schema;
}

function generateZodSchema(schema: OpenAPIV3.SchemaObject): string {
  const schemaCopy = removeDescriptions(schema);
  return jsonSchemaToZod(schemaCopy);
}

interface OpenApiV3SchemasObject {
  [key: string]: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject;
}

type Schemas = OpenAPIV2.DefinitionsObject | OpenApiV3SchemasObject;

interface ZodSchemas {
  [key: string]: string;
}

const isOpenApiV3 = (api: OpenAPI.Document): api is OpenAPIV3.Document => {
  return "openapi" in api && api.openapi?.startsWith("3");
};

const isOpenApiV2 = (api: OpenAPI.Document): api is OpenAPIV2.Document => {
  return "swagger" in api && api.swagger?.startsWith("2");
};

const dir = path.join(process.cwd(), "openapi-codegen");

export async function convertSwaggerToZodSchema(swaggerUrl: string) {
  try {
    const api = await SwaggerParser.bundle(swaggerUrl);

    let schemas: Schemas = {};

    if (isOpenApiV3(api)) {
      schemas = api.components?.schemas || {};
    } else if (isOpenApiV2(api)) {
      schemas = api.definitions || {};
    }

    const zodSchemas: ZodSchemas = {};

    for (const [schemaName, schema] of Object.entries(schemas)) {
      const jsonSchema = {
        ...schema,
      };

      zodSchemas[schemaName] = generateZodSchema(jsonSchema);
    }

    const templatePath = path.join(dir, "templates", "zod-schema.hbs");
    const templateSource = fs.readFileSync(templatePath, "utf-8");
    const template = Handlebars.compile(templateSource);

    const result = template({
      schemas: zodSchemas,
    });

    const formattedResult = await prettier.format(result, {
      parser: "typescript",
    });

    fs.writeFileSync(
      path.join(dir, "out", "generated-schemas.ts"),
      formattedResult,
    );

    console.log("Zod 스키마가 성공적으로 생성되었습니다.");
  } catch (err) {
    console.error("에러 발생:", err);
  }
}
