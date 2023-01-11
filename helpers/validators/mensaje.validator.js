const { getErrorFieldStr, ErrorType } = require('../errormsg_utils');

const mensajeValidationSchema = {
    idUsuarioDestino: {
        exists: {
            errorMessage: getErrorFieldStr(ErrorType.ERROR_MANDATORY_FIELD, 'idUsuarioDestino')
        },
        isInt: {
            errorMessage: getErrorFieldStr(ErrorType.ERROR_INT, 'idUsuarioDestino')
        }
    },
    texto: {
        exists: {
            errorMessage: getErrorFieldStr(ErrorType.ERROR_MANDATORY_FIELD, 'texto')
        },
        isLength: {
            options: { max: 200 },
            errorMessage: getErrorFieldStr(ErrorType.ERROR_MAX_LENGTH_FIELD, 'texto', '200')
        },
        trim: true
    }
}

module.exports = { mensajeValidationSchema };