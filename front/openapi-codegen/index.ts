import { convertSwaggerToZodSchema } from "./src/utils/convertSwaggerToZod";
import { convertSwaggerToResources } from "./src/utils/convertSwaggerToResources";

const swaggerUrl = "https://petstore.swagger.io/v2/swagger.json";

convertSwaggerToZodSchema(swaggerUrl);
convertSwaggerToResources(swaggerUrl);
