const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const openapiSpecification = require('../docs/openapi.specs'); // specification OpenAPI

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(openapiSpecification));
// Nouvelle route JSON pour Postman
router.get('/json', (req, res) => {
  res.json(openapiSpecification);
});

module.exports = router;