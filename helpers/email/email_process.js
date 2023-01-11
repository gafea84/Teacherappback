const { getMailAltaProfesorOptions } = require('./templates/email_alta_profesor.template');
const { getMailNuevoPasswordOptions } = require('./templates/email_nuevo_password.template');
const { sendMail } = require('./email_utils');
const { getById } = require('../../models/usuarios.model');
const { completeUser } = require('../../models/completeUser');
const { getFrom, EmailTypes } = require('../../models/emailspendientes.model');

const emailEnabled = ((process.env.EMAIL_ENABLED) && (process.env.EMAIL_ENABLED !== '0'));

const sendMailProcess = () => {
    if (emailEnabled) {
        const interval =  process.env.EMAIL_PENDIENTES_TIMEOUT * 1000;
        
        setInterval( async() => {
            try {
                let emailPendiente = await getFrom(0);
                while (emailPendiente != null) {
                    await sendMailPendiente(emailPendiente);
                    emailPendiente = await getFrom(emailPendiente.id);
                }
            }
            catch(exception){
                console.log('Error en el proceso de envío de correos electrónicos:', exception);
            }
        },
        interval);
    }
}

const sendMailPendiente = async({id, emailType, referenciaId}) => {
    if (emailEnabled) {
        try {
            const mailOptions = await getMailOptions(emailType, referenciaId);
            await sendMail(id, mailOptions)
        } catch(exception){
            console.log('Error al enviar el correo electrónico:', exception);
        }
    }
}

const getMailOptions = async (emailType, referenciaId) => {    
    switch(emailType) {
        case EmailTypes.ALTA_PROFESOR:
            const usuarioAP       = await getById(referenciaId);
            const usuarioProfesor = await completeUser(usuarioAP);
            return getMailAltaProfesorOptions(usuarioProfesor);
        case EmailTypes.NUEVO_PASSWORD:
            const usuarioNP       = await getById(referenciaId);
            return getMailNuevoPasswordOptions(usuarioNP);
        default:
            return null;
    }
}


module.exports= { sendMailProcess };