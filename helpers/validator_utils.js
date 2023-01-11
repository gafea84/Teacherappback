const { validationResult } = require('express-validator');
const { deleteTmpImage } = require('./image_utils');

// Middleware que comprueba si se ha producido algún error
// en la validaciones.
const checkValidationsResult = (req, res, next) => {    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.mapped());
    }
    next();
}

// Versión en la que puede llegar una imagen en la petición
// que se ha tratado en otro middleware.
const checkValidationsResultImage = (req, res, next) => {    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        if (req.file) {
            deleteTmpImage(req.file);
        }
        return res.status(400).json(errors.mapped());
    }
    next();
}

module.exports = { checkValidationsResult, checkValidationsResultImage };