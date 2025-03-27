import SwaggerParser from "@apidevtools/swagger-parser";
import path from "path";
import { isOpenApiV2 } from "../types/typeGuards";
import { toZodSchema } from "./common/toZodSchema";
import { OUT_DIR, TEMPLATES_DIR } from "../constants/directories";
import { hbsToFile } from "./common/hbsToFile";

interface ZodSchemas {
  [key: string]: string;
}

export async function convertSwaggerToZodSchema(swaggerUrl: string) {
  try {
    const api = await SwaggerParser.bundle(swaggerUrl);

    if (!isOpenApiV2(api)) return;

    const jsonSchemas = api.definitions || {};

    const zodSchemas: ZodSchemas = {};

    for (const [schemaName, jsonSchema] of Object.entries(jsonSchemas)) {
      zodSchemas[schemaName] = toZodSchema(jsonSchema);
    }

    const templatePath = path.join(TEMPLATES_DIR, "zod-schema.hbs");
    const outputPath = path.join(OUT_DIR, "generated-schemas.ts");

    await hbsToFile(templatePath, outputPath, {
      schemas: zodSchemas,
    });

    console.log("Zod 스키마가 성공적으로 생성되었습니다.");
  } catch (err) {
    console.error("에러 발생:", err);
  }
}
