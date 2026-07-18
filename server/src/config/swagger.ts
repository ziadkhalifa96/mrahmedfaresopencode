import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ahmed Fares English Academy API',
      version: '1.0.0',
      description: 'API for Ahmed Fares English Academy Platform',
    },
    servers: [
      {
        url: '/api',
        description: 'API Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            role: { type: 'string', enum: ['admin', 'student'] },
            language: { type: 'string', enum: ['en', 'ar'] },
            theme: { type: 'string', enum: ['light', 'dark'] },
          },
        },
        Course: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            titleAr: { type: 'string' },
            description: { type: 'string' },
            descriptionAr: { type: 'string' },
            slug: { type: 'string' },
            thumbnail: { type: 'string' },
            price: { type: 'number' },
            isFree: { type: 'boolean' },
            isPublished: { type: 'boolean' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Ahmed Fares Academy API Docs',
  }));

  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};
