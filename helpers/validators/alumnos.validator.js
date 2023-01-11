const { getCommonFieldsValidationSchema } = require('./commonFields.validator');

const getAlumnoValidationSchema = (creation) => {
    const alumnoValidationSchema = {        
        ...getCommonFieldsValidationSchema('alumno', creation)
    }
    return alumnoValidationSchema;
}

module.exports = { getAlumnoValidationSchema };