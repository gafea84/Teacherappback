const { getErrorFieldStr, ErrorType } = require('../errormsg_utils');

const pageLimitValidationSchema = {
    page: {
        optional: "true",
        isInt: {
            errorMessage: getErrorFieldStr(ErrorType.ERROR_INT, 'page')
        }
    },
    limit: {
        optional: "true",
        isInt: {
            errorMessage: getErrorFieldStr(ErrorType.ERROR_INT, 'limit')
        }
    }
}

module.exports = { pageLimitValidationSchema };