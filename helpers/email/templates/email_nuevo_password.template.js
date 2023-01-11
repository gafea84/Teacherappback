const pug = require('pug');
const path = require('path');
const { createToken } = require('../../token_utils');
const { getRoleName } = require('../../../models/roles.model');

const getMailNuevoPasswordOptions = async (usuario) => {
    const token = createToken(usuario, getRoleName(usuario.rolId));
    const url   = process.env.BASE_URL + `/api/public/usuarios/passwordform/${usuario.id}/${token}`;
    return {
        from: process.env.EMAIL_USER,
        to: usuario.email,
        subject: 'Petición de nuevo password.',
        text: getEmailTxt(usuario, url),
        html: pug.renderFile(path.join(__dirname, 'email_nuevo_password.pug'), {...usuario, url, horas: process.env.TOKEN_EXPIRATION_HOURS })
    };
}

const getEmailTxt = (url) => {
    return `Petición de un nuevo password. Pulse <a href="${url}">aquí</a> para introducir la nueva clave de acceso. Si no ha solicitado un nuevo password, ignore este correo electrónico.`;
}

module.exports= { getMailNuevoPasswordOptions };