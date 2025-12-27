import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { getQuerySchema, idParamSchema, productSchema, productSizeSchema, productUpdateSchema } from "@/schemas/product.schema";
import { registry as productRegistry } from "@/schemas/product.schema";
import { registry as ingredientRegistry } from "@/schemas/ingredient.schema";

// ...existing code...
// Generate OpenAPI document
export function generateOpenApi() {
  const generator = new OpenApiGeneratorV3([
  ...productRegistry.definitions,
  ...ingredientRegistry.definitions,
]);
  const openApiDoc = generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "NextPizza API",
      version: "1.0.0",
    },
    });
  return openApiDoc;
}

export { mainRegistry as registry };