import swaggerJsdoc from 'swagger-jsdoc';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RadioAssist API',
      version: '1.0.0',
      description: 'AI-assisted radiology report generation — REST API',
    },
    servers: [
      ...(process.env.PUBLIC_URL ? [{ url: process.env.PUBLIC_URL }] : []),
      { url: `http://localhost:${process.env.PORT ?? 3000}` },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [join(__dirname, '../routes/*.ts'), join(__dirname, '../routes/*.js')],
};

export const swaggerSpec = swaggerJsdoc(options);
