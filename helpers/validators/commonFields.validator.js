const { getByEmail, getByUserName } = require('../../models/usuarios.model');
const { getErrorFieldStr, ErrorType } = require('../errormsg_utils');
const { passwordValidationSchema } = require('./password.validator');

const getCommonFieldsValidationSchema = (modelReferenceName, creation) => {
    let commonFieldsValidationSchema = {
        userName: {
            exists: {
                errorMessage: getErrorFieldStr(ErrorType.ERROR_MANDATORY_FIELD, 'userName')
            },
            isLength: {
                options: { max: 25 },
                errorMessage: getErrorFieldStr(ErrorType.ERROR_MAX_LENGTH_FIELD, 'userName', '25')
            },
            custom: {
                options: async (value) => {
                    // Solo hay que comprobar si existe el userName en el alta
                    if (creation) {
                        const modelObject = await getByUserName(value);                        
                        if (modelObject !== null) return Promise.reject(`Ya existe un ${modelReferenceName} con ese userName`);
                        Promise.resolve();
                    } else {
                        Promise.resolve();
                    }
                },
                errorMessage: getErrorFieldStr(ErrorType.ERROR_ALREADY_EXISTS, 'userName', modelReferenceName)
            },
            trim: true
        },
        nombreCompleto: {
            exists: {
                errorMessage: getErrorFieldStr(ErrorType.ERROR_MANDATORY_FIELD, 'nombreCompleto')
            },
            isLength: {
                options: { max: 50 },
                errorMessage: getErrorFieldStr(ErrorType.ERROR_MAX_LENGTH_FIELD, 'nombreCompleto', '50')
            },
            trim: true
        },        
        email: {
            exists: {
                errorMessage: getErrorFieldStr(ErrorType.ERROR_MANDATORY_FIELD, 'email')
            },
            isEmail: {
                errorMessage: getErrorFieldStr(ErrorType.ERROR_EMAIL_FIELD, 'email')
            },
            isLength: {
                options: { max: 50 },
                errorMessage: getErrorFieldStr(ErrorType.ERROR_MAX_LENGTH_FIELD, 'email', '45')
            },
            custom: {
                options: async (value) => {
                    // Solo hay que comprobar si existe el email en el alta
                    if (creation) {
                        const modelObject = await getByEmail(value);
                        if (modelObject !== null) return Promise.reject(`Ya existe un ${modelReferenceName} con ese email`);
                        Promise.resolve();
                    } else {
                        Promise.resolve();
                    }
                },
                errorMessage: getErrorFieldStr(ErrorType.ERROR_ALREADY_EXISTS, 'email', modelReferenceName)
            },
            trim: true
        }        
    }

    // El password solo tiene que estar en el alta del usuario
    if (creation) {
        commonFieldsValidationSchema = {
            ...commonFieldsValidationSchema,
            ...passwordValidationSchema
        };
    }

    return commonFieldsValidationSchema;
}

module.exports = { getCommonFieldsValidationSchema };