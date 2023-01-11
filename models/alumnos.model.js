const { executeQuery, executeQueryOne, executeQueryTrans, beginTransaction, commit, rollBack } = require('../helpers/mysql_utils');
const { createTransUsuario } = require('./usuarios.model');
const { alumnoRoleId } = require('./roles.model');
const { getWhereClause, getOrderByClause, getLimitClause } = require('../helpers/searchUtils/whereclause_utils');
const { getPagesCountClause } = require('../helpers/searchUtils/countpages_utils');

const key_columns    = 'id';
const no_key_columns = 'borrado, usuariosId';
const columns        = `${key_columns}, ${no_key_columns}`;

const createTransAlumno = (db, borrado, usuariosId) => {    
    return executeQueryTrans(
        db,
        `insert into alumnos (${no_key_columns}) values (?, ?)`, 
        [ borrado, usuariosId]
    );
}

const create = async (fields) => {
    const db = await beginTransaction();
    let id, usuarioId;
    try {        
        usuarioId = (await createTransUsuario(db, {...fields, rolId: alumnoRoleId})).insertId;
        id        = (await createTransAlumno (db, 0, usuarioId                    )).insertId;

        await commit(db);
    } catch(exception) {
        await rollBack(db);
        throw exception;
    }

    delete fields.password;
    
    return { usuarioId, rolId: alumnoRoleId, id, ...fields, borrado: 0} ;
}

const getByUserId = (usuariosId) => {
    return executeQueryOne(
        `select id, borrado, usuariosId as usuarioId from alumnos where (usuariosId = ?)`, 
        [ usuariosId ]
    );
}

const getCompleteAlumnoById = (alumnoId) => {
    return executeQueryOne(
        'select a.id as id, borrado, usuariosId as usuarioId, userName, nombreCompleto, email, rolId, imagen ' +
        `from alumnos as a inner join usuarios as u on (a.usuariosId = u.id) where (a.id = ?)`, 
        [ alumnoId ]
    );
}

const getCompleteAlumnoByUserId = (usuarioId) => {
    return executeQueryOne(
        'select a.id as id, borrado, usuariosId as usuarioId, userName, nombreCompleto, email, rolId, imagen ' +
        `from alumnos as a inner join usuarios as u on (a.usuariosId = u.id) where (a.usuariosId = ?)`, 
        [ usuarioId ]
    );
}

const searchFields = ['id', 'borrado', 'usuariosId', 'userName', 'nombreCompleto', 'email', 'rolId', 'imagen'];
const search = ({ searchConditions, orderByConditions }, page, limit) => {    

    const fieldsResult = 'a.id, borrado, usuariosId as usuarioId, userName, nombreCompleto, email, rolId, imagen';
    let selectSentence = 'select ? from alumnos as a inner join usuarios as u on (a.usuariosId = u.id)';
    
    const whereClause   = getWhereClause(searchFields, searchConditions, 'a.');    
    const orderByClause = getOrderByClause(searchFields, orderByConditions, 'a.');
    const limitClause   = getLimitClause(limit, page);

    return Promise.all([
            // No vale, mete comillas --> executeQuery(selectSentence, [fieldsResult]),
            executeQuery(selectSentence.replace('?', fieldsResult) + whereClause + orderByClause + limitClause, []),
            limit ? executeQueryOne(selectSentence.replace('?', getPagesCountClause(limit)) + whereClause, [])
                  : { pages: 1 }
    ]);
}

const searchByTeacherId = ({ searchConditions, orderByConditions }, idProfesor, page, limit) => {    

    const fieldsResult = 'a.id, borrado, usuariosId as usuarioId, userName, nombreCompleto, email, rolId, imagen';
    let selectSentence = 'select ? from alumnos as a inner join usuarios as u on (a.usuariosId = u.id) '     +
                                                    'inner join inscripciones as i on (a.id = i.alumnosId) ' +
                                                    'inner join profesores as p on (p.id = i.profesoresId) ';
    
    const whereClause   = getWhereClause(searchFields, searchConditions, 'a.', `(p.id = ${idProfesor}) and (borrado = 0)`);
    const orderByClause = getOrderByClause(searchFields, orderByConditions, 'a.');
    const limitClause   = getLimitClause(limit, page);

    return Promise.all([
            executeQuery(selectSentence.replace('?', fieldsResult) + whereClause + orderByClause + limitClause, []),
            limit ? executeQueryOne(selectSentence.replace('?', getPagesCountClause(limit)) + whereClause, [])
                  : { pages: 1 }
    ]);
}

const logicDelete = (id) => {
    return executeQuery(
        `update alumnos set borrado = 1 where (id = ?)`, 
        [ id ]
    );
}

const logicUndelete = (id) => {
    return executeQuery(
        `update alumnos set borrado = 0 where (id = ?)`, 
        [ id ]
    );
}

module.exports = { 
    create,
    getByUserId,
    getCompleteAlumnoById,
    getCompleteAlumnoByUserId,
    search,
    searchByTeacherId,
    searchFields,
    logicDelete,
    logicUndelete
};