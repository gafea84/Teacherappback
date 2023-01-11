const { adminRoleId, profesorRoleId, alumnoRoleId } = require('./roles.model');
const { getByUserId: getProfesorByUserId } = require('./profesores.model');
const { getByUserId: getAlumnoByUserId } = require('./alumnos.model');

const completeUser = async (user) => {
    if (user.rolId === adminRoleId) {
        return user;
    }
    if (user.rolId === profesorRoleId) {
        profesor = await getProfesorByUserId(user.id);
        if (profesor !== null) {
            delete user.id; // Nos quedamos con el id del profesor.
            return { ...user, ...profesor };
        }
    }
    if (user.rolId === alumnoRoleId) {
        alumno = await getAlumnoByUserId(user.id);
        if (alumno !== null) {
            delete user.id; // Nos quedamos con el id del alumno.
            return { ...user, ...alumno };
        }
    }
    return user;
};

exports.completeUser = completeUser;
