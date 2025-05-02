const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'SmartPark API',
    version: '2.1.0',
    description: 'API for managing parking spots and reservations',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
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
  },
};

module.exports = {
  swaggerDefinition,
  apis: ['./routes/*.js', './controllers/*.js'],
};