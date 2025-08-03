const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const openapiSpecification = require('../docs/openapi.specs'); // specification OpenAPI

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(openapiSpecification));

module.exports = router;