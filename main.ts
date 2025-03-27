import { convertSwaggerToZodSchema } from "./src/utils/convertSwaggerToZod";
import { convertSwaggerToResources } from "./src/utils/convertSwaggerToResources";

async function main() {
  const swaggerUrl = "https://petstore.swagger.io/v2/swagger.json";

  try {
    await convertSwaggerToZodSchema(swaggerUrl);
    await convertSwaggerToResources(swaggerUrl);
  } catch (error) {
    console.error("Error converting Swagger:", error);
  }
}

main();
