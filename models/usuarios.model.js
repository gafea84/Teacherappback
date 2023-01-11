const { executeQuery, executeQueryOne, executeQueryTrans } = require('../helpers/mysql_utils');
const { adminRoleId } = require('./roles.model');

const key_columns         = 'id';
const no_key_columns      = 'userName, nombreCompleto, email, rolId, imagen';
const password_column     = 'password';
const columns             = `${key_columns}, ${no_key_columns}, ${password_column}`;
const no_password_columns = `${key_columns}, ${no_key_columns}`;

const create = ({userName, nombreCompleto, email, password, rolId}) => {
    return executeQuery(
        `insert into usuarios (${no_key_columns}, ${password_column}) values (?, ?, ?, ?, null, ?)`, 
        [ userName, nombreCompleto, email, rolId, password ]
    );
}

const createTransUsuario = (db, {userName, nombreCompleto, email, password, rolId}) => {
    return executeQueryTrans(
        db,
        `insert into usuarios (${no_key_columns}, ${password_column}) values (?, ?, ?, ?, null, ?)`, 
        [ userName, nombreCompleto, email, rolId, password ]
    );
}

const getAdministrador = () => {
    return executeQueryOne(
        `select * from usuarios where (rolId=${adminRoleId}) limit 1`
    )
}

const updateNotPasswordFieldsTrans = (id, { nombreCompleto, userName, email }) => {
    return executeQuery(
        `update usuarios set nombreCompleto = ?, userName = ?, email = ? where (id = ?)`, 
        [ nombreCompleto, userName, email, id ]
    );
}

const updatePassword = (id, password) => {
    return executeQuery(
        `update usuarios set password = ? where (id = ?)`, 
        [ password, id ]
    );
}

const updateImage = (id, imagen) => {
    return executeQuery(
        `update usuarios set imagen = ? where (id = ?)`, 
        [ imagen, id ]
    );
}

const getByEmail = (email) => {
    return executeQueryOne(
        `select ${no_password_columns} from usuarios where (email = ?)`, 
        [ email ]
    );
}

const getByEmailWithPassword = (email) => {
    return executeQueryOne(
        `select ${columns} from usuarios where (email = ?)`, 
        [ email ]
    );
}

const getByEmailNotId = (email, id) => {
    return executeQueryOne(
        `select ${no_password_columns} from usuarios where (email = ?) and (id <> ?)`, 
        [ email, id ]
    );
}

const getByUserName = (userName) => {
    return executeQueryOne(
        `select ${no_password_columns} from usuarios where (userName = ?)`, 
        [ userName ]
    );
}

const getByUserNameNotId = (userName, id) => {
    return executeQueryOne(
        `select ${no_password_columns} from usuarios where (userName = ?) and (id <> ?)`, 
        [ userName, id ]
    );
}

const getById = (id) => {
    return executeQueryOne(
        `select ${no_password_columns} from usuarios where (id = ?)`, 
        [ id ]
    );
}

const getAdminsEmail = () => {
    return executeQuery(
        `select email from usuarios where (rolId = ?)`,
        [adminRoleId]
    )
}

module.exports = {
    create,
    createTransUsuario,
    getAdministrador,
    getAdminsEmail,
    getByEmail,
    getByEmailNotId,
    getByEmailWithPassword,
    getById,
    getByUserName,
    getByUserNameNotId,
    updatePassword,
    updateNotPasswordFieldsTrans,
    updateImage
};