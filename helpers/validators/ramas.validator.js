const { getErrorFieldStr, ErrorType } = require("../errormsg_utils");

const ramaValidationSchema = {
    nombre: {
        exists: {
            errorMessage: getErrorFieldStr(ErrorType.ERROR_MANDATORY_FIELD, 'nombre')
        },
        isLength: {
            options: { max: 25 },
            errorMessage: getErrorFieldStr(ErrorType.ERROR_MAX_LENGTH_FIELD, 'nombre', '25')
        },
        trim: true
    }
};

module.exports = { ramaValidationSchema };