const { getErrorFieldStr, ErrorType } = require('../errormsg_utils');
const { searchValidationSchema } = require('./search.validator');

const opinionesPublicValidationSchema = (fields) => {
    return {
        id: {
            exists: {
                errorMessage: getErrorFieldStr(ErrorType.ERROR_MANDATORY_FIELD, 'latitud')
            },
            isDecimal: {
                errorMessage: getErrorFieldStr(ErrorType.ERROR_DECIMAL, 'latitud')
            }
        },
        ...searchValidationSchema(fields)
    };
}

module.exports = { opinionesPublicValidationSchema };