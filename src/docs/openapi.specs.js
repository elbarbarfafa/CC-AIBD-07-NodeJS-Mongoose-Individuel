const swaggerJSDoc = require("swagger-jsdoc");

// Options pour la documentation Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API - Express.js avec MongoDB',
      version: '1.0.0',
      description: 'Une simple API pour démontrer Swagger',
    },
  },
  apis: ['.src/routes/**.js'], // Fichiers contenant les annotations Swagger (à savoir les routes)
};

const openapiSpecification = swaggerJSDoc(options);

module.exports = openapiSpecification;