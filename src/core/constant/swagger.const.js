import swaggerJSDoc from 'swagger-jsdoc';

export const swagger = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PIX API',
      version: '1.0.0',
      description: 'API do desafio PIX',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: [
    './src/features/**/routes/*.routes.js',
  ],
});
