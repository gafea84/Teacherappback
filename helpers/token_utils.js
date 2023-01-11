const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');

const { getByUserId } = require('../models/alumnos.model');
const { alumnoRoleDescription } = require('../models/roles.model');

const checkToken = async (req, res, next) => {
    const { ok, statusCode, message, user } = await validateTokenAux(req);

    if (!ok) {
        return res.status(statusCode)
                  .json({ errorMessage: message });
    }

    req.user = user;

    next();
}

// Simplemente comprueba si existe y es válido, no devuelve respuesta de error
// si no es correcto. Se usa para la consulta de profesores de la parte pública
// (solo si hay token y es bueno, se muestran los datos de contacto de profesor).
const validateToken = async (req) => {
    const ok = (await validateTokenAux(req)).ok;    
    return ok;
};

const validateTokenAux = async (req) => {
    if (!req.headers['authorization']) {
        return {
            ok: false,
            statusCode: 401,
            message: 'Debes incluir el token de autenticación'
        }
    }

    let { authorization: token } = req.headers;

    token = token.replace('Bearer ', ''); // Para los que vienen de swagger.

    return validateTokenStr(token);
}

const validateTokenStr = async (token) => {
    let obj;
    try {
        obj = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    } catch (error) {
        return {
            ok: false,
            statusCode: 401,
            message: 'El token incluido no es válido'
        }
    }

    if (obj.expiration_date < dayjs().unix()) {
        return {
            result: false,
            statusCode: 401,
            message: 'El token está caducado'
        }
    }

    if (obj.role === alumnoRoleDescription) {
        const alumno = await getByUserId(obj.id);
        if ((alumno === null) || (alumno.borrado))
        {
            return {
                ok: false,
                statusCode: 401,
                message: 'El usuario se ha borrado'
            }
        }
    }

    return {
        ok: true,
        user: obj
    };
}

const checkRole = (role) => {
    return (req, res, next) => {        
        if (req.user.role !== role) {
            return res.status(401)
                      .json({ errorMessage: `Restringido el acceso. Solo usuarios con rol: ${role}` });
        }
        next();
    }
}

const checkRoles = (roles) => {
    return (req, res, next) => {        
        if (!roles.includes(req.user.role)) {
            return res.status(401)
                      .json({ errorMessage: `Restringido el acceso. Solo usuarios con rol: ${roles.join(', ')}` });
        }
        next();
    }
}

const createToken = (user, roleName) => {
    const obj = {
        id: user.id,
        role: roleName,
        expiration_date: dayjs().add(process.env.TOKEN_EXPIRATION_HOURS, 'hours').unix()
    }

    return jwt.sign(obj, process.env.TOKEN_SECRET_KEY);
}

module.exports = { checkToken, checkRole, checkRoles, createToken, validateToken, validateTokenStr };