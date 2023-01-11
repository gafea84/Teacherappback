const { getErrorFieldStr, ErrorType } = require("../errormsg_utils");
const { passwordValidationSchema } = require('./password.validator');

const regeneratePasswordSchema = {
    id: {
        exists: {
            errorMessage: getErrorFieldStr(ErrorType.ERROR_MANDATORY_FIELD, 'id')
        },
        isInt: {
            errorMessage: getErrorFieldStr(ErrorType.ERROR_INT, 'id')
        }
    },
    token: {
        exists: {
            errorMessage: getErrorFieldStr(ErrorType.ERROR_MANDATORY_FIELD, 'id')
        }
    },
    ...passwordValidationSchema    
}

module.exports = { regeneratePasswordSchema };