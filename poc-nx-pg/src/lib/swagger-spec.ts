import { createSwaggerSpec } from "next-swagger-doc";
import { PostCreateDto } from "src/dto";

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "src/app/api", // define api folder under app folder
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Next Swagger API Example",
        version: "1.0",
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
        schemas: {
          PostCreateDto: {
            type: "object",
            properties: {
              title: {
                type: "string",
                required: "true",
              },
              content: {
                type: "string",
                required: "true",
              },
              published: {
                type: "boolean",
                required: "true",
              },
            },
            example: {
              title: "Game Over for GoLang",
              content:
                "In upcoming years Rust is expected to replace Golang as it offer robust dev experience with growing community support.",
              published: false,
            },
          },
        },
      },
      security: [],
    },
  });
  return spec;
};
