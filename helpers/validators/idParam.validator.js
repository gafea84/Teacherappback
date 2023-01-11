const { param } = require('express-validator');

const idParamValidator = param('id').exists().isInt();

module.exports = { idParamValidator };