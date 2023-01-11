const pug = require('pug');
const path = require('path');
const { getAdminsEmail } = require("../../../models/usuarios.model");

const getMailAltaProfesorOptions = async (usuarioProfesor) => {
    const emailList = await getAdminsEmail();
    const emailTo   = emailList.map(element => element.email).join(',');
    return {
        from: process.env.EMAIL_USER,
        to: emailTo,
        subject: 'Nueva petición de alta de profesor',
        text: getEmailTxt(usuarioProfesor),
        html: pug.renderFile(path.join(__dirname, 'email_alta_profesor.pug'), {...usuarioProfesor, url: process.env.EMAIL_URL_VALIDAR_PROFESOR })
    };
}

const getEmailTxt = (usuarioProfesor) => {
    if (usuarioProfesor === null) {
        return 'Nueva petición de alta de profesor';
    } else {
        return `Nueva petición de alta de profesor. Nombre: ${usuarioProfesor.nombreCompleto}. Rama: ${usuarioProfesor.nombreRama}. Id: ${usuarioProfesor.id}`;
    }
}

module.exports= { getMailAltaProfesorOptions };