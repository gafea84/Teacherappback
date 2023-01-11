const { getMailAltaProfesorOptions } = require('./templates/email_alta_profesor.template');
const { getMailNuevoPasswordOptions } = require('./templates/email_nuevo_password.template');
const { sendMail } = require('./email_utils');
const { EmailTypes } = require('../../models/emailspendientes.model');

const emailEnabled = ((process.env.EMAIL_ENABLED) && (process.env.EMAIL_ENABLED !== '0'));

const sendMailDataLoaded = async(id, emailType, data) => {
    if (emailEnabled) {
        try {
            const mailOptions = await getMailOptionsDataLoaded(emailType, data);
            await sendMail(id, mailOptions)
        } catch(exception){
            console.log('Error al enviar el correo electrónico:', exception);
        }
    }  
}

const getMailOptionsDataLoaded = (emailType, data) => {
    switch(emailType) {
        case EmailTypes.ALTA_PROFESOR:
            return getMailAltaProfesorOptions(data);
        case EmailTypes.NUEVO_PASSWORD:
            return getMailNuevoPasswordOptions(data);
        default:
            return null;
    }
}

module.exports= { sendMailDataLoaded };