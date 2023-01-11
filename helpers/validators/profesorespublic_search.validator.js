const { getErrorFieldStr, ErrorType } = require('../errormsg_utils');
const { searchValidationSchema } = require('./search.validator');

const publicTeacherSearchValidationSchema = (fields) => {
    return {
        latitud: {
            exists: {
                errorMessage: getErrorFieldStr(ErrorType.ERROR_MANDATORY_FIELD, 'latitud')
            },
            isDecimal: {
                errorMessage: getErrorFieldStr(ErrorType.ERROR_DECIMAL, 'latitud')
            }
        },
        longitud: {
            exists: {
                errorMessage: getErrorFieldStr(ErrorType.ERROR_MANDATORY_FIELD, 'longitud')
            },
            isDecimal: {
                errorMessage: getErrorFieldStr(ErrorType.ERROR_DECIMAL, 'longitud')
            }
        },
        maximaDistancia: {
            exists: {
                errorMessage: getErrorFieldStr(ErrorType.ERROR_MANDATORY_FIELD, 'maximaDistancia')
            },
            isDecimal: {
                errorMessage: getErrorFieldStr(ErrorType.ERROR_DECIMAL, 'maximaDistancia')
            }
        },
        ...searchValidationSchema(fields)
    };
}

module.exports = { publicTeacherSearchValidationSchema };