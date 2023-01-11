const { getErrorFieldStr, ErrorType } = require('../errormsg_utils');

const passwordValidationSchema = {    
    password: {
        exists: {
            errorMessage: getErrorFieldStr(ErrorType.ERROR_MANDATORY_FIELD, 'password')
        },
        isLength: {
            options: { min: 6 },
            errorMessage: getErrorFieldStr(ErrorType.ERROR_MIN_LENGTH_FIELD, 'password', '6')
        }
    }
}

module.exports = { passwordValidationSchema };