const { executeQuery, executeQueryOne, executeQueryTrans } = require('../helpers/mysql_utils');

const EmailTypes = {
    ALTA_PROFESOR: 1,
    NUEVO_PASSWORD: 2
}

const key_columns    = 'id';
const no_key_columns = 'emailType, referenciaId';
const columns        = `${key_columns}, ${no_key_columns}`;

const create = (emailType, referenciaId) => {
    return executeQuery(`insert into emailspendientes (${no_key_columns}) values (?, ?)`, [ emailType, referenciaId ]);
}

const createTransEmailPendiente = (db, emailType, referenciaId) => {
    return executeQueryTrans(db, `insert into emailspendientes (${no_key_columns}) values (?, ?)`, [ emailType, referenciaId ]);
}

const getById = (id) => {    
    return executeQueryOne(
        `select ${columns} from emailspendientes where (id = ?)`, 
        [ id ]
    );
}

const getFrom = (fromId) => {
    //const fromIdStr = (fromId) ? `where (id > ${fromId})` : '';
    return executeQueryOne(
        `select ${columns} from emailspendientes ${(fromId) ? `where (id > ${fromId})` : ''} order by id limit 1`, 
        [ ]
    );
}

const remove = (id) => {
    return executeQueryOne(
        `delete from emailspendientes where id = ?`, 
        [ id ]
    );
}

module.exports = { create, createTransEmailPendiente, getById, getFrom, remove, EmailTypes };