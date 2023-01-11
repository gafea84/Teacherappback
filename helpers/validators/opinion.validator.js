const { getErrorFieldStr, ErrorType } = require('../errormsg_utils');

const opinionValidationSchema = {
    id: {
        exists: {
            errorMessage: getErrorFieldStr(ErrorType.ERROR_MANDATORY_FIELD, 'id')
        },
        isInt: {
            errorMessage: getErrorFieldStr(ErrorType.ERROR_INT, 'id')
        }
    },
    puntuacion: {
        exists: {
            errorMessage: getErrorFieldStr(ErrorType.ERROR_MANDATORY_FIELD, 'puntuacion')
        },
        isInt: {
            errorMessage: getErrorFieldStr(ErrorType.ERROR_INT, 'puntuacion')
        }
    },
    comentario: {
        exists: {
            errorMessage: getErrorFieldStr(ErrorType.ERROR_MANDATORY_FIELD, 'comentario')
        },
        isLength: {
            options: { max: 100 },
            errorMessage: getErrorFieldStr(ErrorType.ERROR_MAX_LENGTH_FIELD, 'comentario', '100')
        },
        trim: true
    }
}

module.exports = { opinionValidationSchema };