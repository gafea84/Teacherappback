const { executeQuery, executeQueryOne } = require('../helpers/mysql_utils');

const adminRoleId    = 1;
const alumnoRoleId   = 2;
const profesorRoleId = 3;
const adminRoleDescription    = 'admin';
const alumnoRoleDescription   = 'alumno';
const profesorRoleDescription = 'profesor';

const create = (id, descripcion) => {
    return executeQuery(
        `insert into rol (id, descripcion) values (?, ?)`, 
        [ id, descripcion ]
    );
}

const createDefaultRoles = () => {
    create( adminRoleId, adminRoleDescription);
    create( alumnoRoleId, alumnoRoleDescription);
    create( profesorRoleId, profesorRoleDescription);
}

const checkIsEmpty = () => {
    return executeQueryOne('SELECT (NOT EXISTS (SELECT 1 FROM rol)) AS isEmpty');
}

const getRoleName = (roleId) => {
    if (roleId === adminRoleId) {
        return adminRoleDescription;
    } 
    if (roleId === profesorRoleId) {
        return profesorRoleDescription;
    } 
    if (roleId === alumnoRoleId) {
        return alumnoRoleDescription;
    } 
    return alumnoRoleDescription;
}

module.exports = {
    create,
    createDefaultRoles,
    checkIsEmpty,
    getRoleName,
    adminRoleId,
    alumnoRoleId,
    profesorRoleId,
    adminRoleDescription,
    alumnoRoleDescription,
    profesorRoleDescription
}