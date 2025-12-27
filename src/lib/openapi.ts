import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { getQuerySchema, idParamSchema, productSchema, productSizeSchema, productUpdateSchema } from "@/schemas/product.schema";
import { registry } from "@/schemas/product.schema";

// Example: Create a registry and register schemas


// Generate OpenAPI document
export function generateOpenApi() {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  const openApiDoc = generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "NextPizza API",
      version: "1.0.0",
    },
    });
  return openApiDoc;
}


export { registry };