// Añadimos este objeto y esta función para que todos los mensajes
// de error devueltos por las validaciones sean consistentes.
// Aquí se podrían también traducir, recuperar de una base de datos...

const FIELD_STR = '&&&';
const VALUE_STR = '$$$';

const ErrorType = {
    ERROR_MANDATORY_FIELD:   `El campo ${FIELD_STR} es obligatorio`,
    ERROR_MAX_LENGTH_FIELD:  `El tamaño máximo del campo ${FIELD_STR} es de ${VALUE_STR} caracteres`,
    ERROR_MIN_LENGTH_FIELD:  `El tamaño mínimo del campo ${FIELD_STR} es de ${VALUE_STR} caracteres`,
    ERROR_EMAIL_FIELD:       `El campo ${FIELD_STR} no es un correo electrónico válido`,
    ERROR_URL_FIELD:         `El campo ${FIELD_STR} no es una URL válida`,
    ERROR_NO_EXISTS:         `No existe ${VALUE_STR} con la clave indicada en ${FIELD_STR}`,
    ERROR_DATE_FIELD:        `El campo ${FIELD_STR} no es una fecha válida`,
    ERROR_ALREADY_EXISTS:    `Ya existe un ${VALUE_STR} con el ${FIELD_STR} indicado`,
    ERROR_MAX_DECIMALS:      `El campo ${FIELD_STR} no puede tener más de ${VALUE_STR} decimales`,
    ERROR_DECIMAL_MIN_MAX:   `El campo ${FIELD_STR} debe ser un decimal entre ${VALUE_STR}`,
    ERROR_INT_MIN_MAX:       `El campo ${FIELD_STR} debe ser un entero entre ${VALUE_STR}`,
    ERROR_INT:               `El campo ${FIELD_STR} debe ser un entero`,
    ERROR_DECIMAL:           `El campo ${FIELD_STR} debe ser un decimal`,
    ERROR_VALUE_IN_LIST:     `Los valores posibles de ${FIELD_STR} son: ${VALUE_STR}`,
    ERROR_COLUMN_FIELD:      `El valor del campo ${FIELD_STR} debe coincidir con el nombre de una columna en la tabla consultada`
}

const getErrorFieldStr = (error, fieldName, valueStr) => {
    const str = (valueStr) ? error.replace(VALUE_STR, valueStr) : error;
    return str.replace(FIELD_STR, fieldName);
};

module.exports = { ErrorType, getErrorFieldStr };