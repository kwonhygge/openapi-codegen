import { convertSwaggerToZodSchema } from "./utils/convertSwaggerToZod";
import { convertSwaggerToResources } from "./utils/convertSwaggerToResources";

convertSwaggerToZodSchema("https://petstore.swagger.io/v2/swagger.json");
convertSwaggerToResources("https://petstore.swagger.io/v2/swagger.json");
