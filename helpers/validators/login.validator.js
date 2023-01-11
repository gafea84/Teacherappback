const { emailValidationSchema } = require('./email.validator');
const { passwordValidationSchema } = require('./password.validator');

const loginValidationSchema = {
    ...emailValidationSchema,
    ...passwordValidationSchema    
}

module.exports = { loginValidationSchema };