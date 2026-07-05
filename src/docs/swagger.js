import swaggerJSDoc from "swagger-jsdoc";

const PORT = process.env.PORT ?? 3000;

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Nature Trips API",
      version: "1.0.0",
      description: "Swagger documentation for the Nature Trips backend API",
    },
    servers: [
      {
        url:
          process.env.DEPLOYED_SERVER_URL ??
          "https://project-terracode-be.onrender.com",
        description: "Deployed server",
      },
      {
        url: `http://localhost:${PORT}`,
        description: "Local development server",
      },
    ],
    tags: [
      {
        name: "Auth",
        description: "Authentication endpoints",
      },
      {
        name: "Users",
        description: "User profile, user stories, and saved stories endpoints",
      },
      {
        name: "Stories",
        description: "Story list, story detail, and recommended stories endpoints",
      },
      {
        name: "Categories",
        description: "Story category endpoints",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ObjectId: {
          type: "string",
          pattern: "^[0-9a-fA-F]{24}$",
          example: "68498236a100312bea018fe6",
        },

        ErrorResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Not authorized",
            },
          },
        },

        ValidationErrorResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Validation failed",
            },
            errors: {
              type: "object",
              additionalProperties: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              example: {
                password: ["Password must contain at least one special character"],
              },
            },
          },
        },

        RegisterRequest: {
          type: "object",
          required: ["name", "email", "password"],
          additionalProperties: false,
          properties: {
            name: {
              type: "string",
              minLength: 2,
              maxLength: 32,
              pattern:
                "^[A-Za-zА-Яа-яІіЇїЄєҐґ]+(?:[ '’-][A-Za-zА-Яа-яІіЇїЄєҐґ]+)*$",
              description:
                "Required. Must be 2-32 characters. Only English or Ukrainian letters, spaces, hyphens, and apostrophes are allowed.",
              example: "Test User",
            },
            email: {
              type: "string",
              format: "email",
              maxLength: 64,
              description:
                "Required. Must be a valid email. Trimmed and converted to lowercase by backend.",
              example: "testuser@example.com",
            },
            password: {
              type: "string",
              format: "password",
              minLength: 8,
              maxLength: 128,
              description:
                "Required. Must be 8-128 characters, contain no whitespace, and contain at least one special character.",
              example: "password123!",
            },
          },
        },

        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          additionalProperties: false,
          properties: {
            email: {
              type: "string",
              format: "email",
              description:
                "Required. Must be a valid email. Trimmed and converted to lowercase by backend.",
              example: "testuser@example.com",
            },
            password: {
              type: "string",
              format: "password",
              description: "Required. User password.",
              example: "password123!",
            },
          },
        },

        User: {
          type: "object",
          properties: {
            _id: {
              $ref: "#/components/schemas/ObjectId",
            },
            id: {
              $ref: "#/components/schemas/ObjectId",
            },
            name: {
              type: "string",
              example: "Test User",
            },
            email: {
              type: "string",
              format: "email",
              example: "testuser@example.com",
            },
            avatarUrl: {
              type: "string",
              example: "",
            },
            articlesAmount: {
              type: "integer",
              example: 0,
            },
            savedArticles: {
              type: "array",
              items: {
                $ref: "#/components/schemas/ObjectId",
              },
              example: ["68498236a100312bea018fe6"],
            },
            token: {
              type: "string",
              nullable: true,
              example: null,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2026-07-05T15:18:09.263Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2026-07-05T15:18:09.263Z",
            },
          },
        },

        AuthUser: {
          type: "object",
          properties: {
            id: {
              $ref: "#/components/schemas/ObjectId",
            },
            name: {
              type: "string",
              example: "Test User",
            },
            email: {
              type: "string",
              format: "email",
              example: "testuser@example.com",
            },
            avatarUrl: {
              type: "string",
              example: "",
            },
            articlesAmount: {
              type: "integer",
              example: 0,
            },
            savedArticles: {
              type: "array",
              items: {
                $ref: "#/components/schemas/ObjectId",
              },
              example: [],
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2026-07-05T15:18:09.263Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2026-07-05T15:18:09.263Z",
            },
          },
        },

        Story: {
          type: "object",
          properties: {
            _id: {
              $ref: "#/components/schemas/ObjectId",
            },
            img: {
              type: "string",
              example:
                "https://ftp.goit.study/img/green-tourism/68498236a100312bea018fe6.webp",
            },
            title: {
              type: "string",
              example: "Test story title",
            },
            article: {
              type: "string",
              example: "Test story article text.",
            },
            category: {
              oneOf: [
                {
                  $ref: "#/components/schemas/ObjectId",
                },
                {
                  $ref: "#/components/schemas/Category",
                },
              ],
            },
            rate: {
              type: "number",
              example: 14,
            },
            ownerId: {
              $ref: "#/components/schemas/ObjectId",
            },
            date: {
              type: "string",
              example: "2025-09-20",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        RecommendedStory: {
          allOf: [
            {
              $ref: "#/components/schemas/Story",
            },
            {
              type: "object",
              properties: {
                savesCount: {
                  type: "integer",
                  example: 2,
                },
              },
            },
          ],
        },

        Category: {
          type: "object",
          properties: {
            _id: {
              $ref: "#/components/schemas/ObjectId",
            },
            category: {
              type: "string",
              example: "Еко-ферми та гастротури",
            },
          },
        },

        Pagination: {
          type: "object",
          properties: {
            page: {
              type: "integer",
              example: 1,
            },
            limit: {
              type: "integer",
              example: 10,
            },
            total: {
              type: "integer",
              example: 25,
            },
            totalPages: {
              type: "integer",
              example: 3,
            },
            hasNextPage: {
              type: "boolean",
              example: true,
            },
            hasPreviousPage: {
              type: "boolean",
              example: false,
            },
          },
        },

        AccessTokenResponse: {
          type: "object",
          properties: {
            accessToken: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
          },
        },
      },
    },
  },
  apis: ["./src/docs/*.js"],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);