const { getErrorFieldStr, ErrorType } = require('../errormsg_utils');

const searchValidationSchema = (fields) => {
    return {
        'searchConditions.*.column': {
            exists: {
                errorMessage: getErrorFieldStr(ErrorType.ERROR_MANDATORY_FIELD, 'column')
            },
            isIn: {
                options: [fields],
                errorMessage: getErrorFieldStr(ErrorType.ERROR_COLUMN_FIELD, 'column')
            },
            trim: true
        },
        'searchConditions.*.operator': {
            exists: {
                errorMessage: getErrorFieldStr(ErrorType.ERROR_MANDATORY_FIELD, 'operator')
            },
            isIn: {
                options: [[ '=', '>', '>=', '<', '<=', '<>', 'like' ]],
                errorMessage: getErrorFieldStr(ErrorType.ERROR_VALUE_IN_LIST, 'operator', '=, >, >=, <, <=, <>, like')
            },
            trim: true
        },
        'searchConditions.*.value': {
            exists: {
                errorMessage: getErrorFieldStr(ErrorType.ERROR_MANDATORY_FIELD, 'value')
            },
            trim: true
        },
        'orderByConditions.*.column': {
            exists: {
                errorMessage: getErrorFieldStr(ErrorType.ERROR_MANDATORY_FIELD, 'column')
            },
            isIn: {
                options: [fields],
                errorMessage: getErrorFieldStr(ErrorType.ERROR_COLUMN_FIELD, 'column')
            },
            trim: true
        },
        'orderByConditions.*.order': {
            exists: {
                errorMessage: getErrorFieldStr(ErrorType.ERROR_MANDATORY_FIELD, 'order')
            },
            isIn: {
                options: [[ 'asc', 'desc']],
                errorMessage: getErrorFieldStr(ErrorType.ERROR_VALUE_IN_LIST, 'operator', 'asc, desc')
            },
            trim: true,
            toLowerCase: true
        }
    }
}

module.exports = { searchValidationSchema };