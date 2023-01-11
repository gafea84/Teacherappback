const dayjs = require('dayjs');
const { executeQuery, executeQueryOne, executeQueryOneTrans } = require('../helpers/mysql_utils');
const { getWhereClause, getOrderByClause, getLimitClause } = require('../helpers/searchUtils/whereclause_utils');

const key_columns    = 'id';
const no_key_columns = 'estado, puntuacion, comentario, fechaPuntuacion, alumnosId, profesoresId';
const columns        = `${key_columns}, ${no_key_columns}`;

const create = (alumnoId, profesoresId) => {
    return executeQuery(
        `insert into inscripciones (${no_key_columns}) values (?, ?, ?, ?, ?, ?)`,
        [ 0, null, null, null, alumnoId, profesoresId ]
    );
}

const accept = (id) => {
    return executeQuery(
        `update inscripciones set estado = 1 where (id = ?)`,
        [ id ]
    );
}

const opinionTrans = (db, { id, puntuacion, comentario }) => {
    return executeQueryOneTrans(
        db,
        `update inscripciones set puntuacion = ?, comentario = ?, fechaPuntuacion = ? where (id = ?)`,
        [ puntuacion, comentario, dayjs().format('YYYY-MM-DD'), id ]
    );
}

const getById = (id) => {
    return executeQueryOne(
        `select ${columns} from inscripciones where (id = ?)`, 
        [ id ]
    );
}

const getByAlumnoIdProfesorId = (profesorId, alumnoId) => {
    return executeQueryOne(
        `select ${columns} from inscripciones where (alumnosId = ?) and (profesoresId = ?)`, 
        [ alumnoId, profesorId ]
    );
}

const searchOpinionesFields = [ 'puntuacion', 'comentario', 'fechaPuntuacion',];
const searchOpiniones = ({ searchConditions, orderByConditions, id: idProfesor }, page, limit) => {    

    const fieldsResult = 'puntuacion, comentario, fechaPuntuacion';
    let selectSentence = 'select ? from inscripciones';                         
    
    const whereClause   = getWhereClause(searchOpinionesFields, searchConditions, '', `(profesoresId = ${idProfesor}) and (puntuacion is not null)`);
    const orderByClause = getOrderByClause(searchOpinionesFields, orderByConditions, '');
    const limitClause   = getLimitClause(limit, page);

    return Promise.all([
            executeQuery(selectSentence.replace('?', fieldsResult) + whereClause + orderByClause + limitClause, []),
            limit ? executeQueryOne(selectSentence.replace('?', getPagesCountClause(limit)) + whereClause, [])
                  : { pages: 1 }
    ]);
}

const searchByProfesorIdFields = ['id', 'estado', 'puntuacion', 'comentario', 'fechaPuntuacion', 'alumnosId', 'profesoresId',
                                  'borrado', 'userName', 'nombreCompleto', 'email', 'imagen', 'rolId' ];
const searchInscripcionesByProfesorId = ({ searchConditions, orderByConditions}, idProfesor, page, limit) => {    
    const fieldsResult = 'i.id, estado, puntuacion, comentario, fechaPuntuacion, alumnosId, profesoresId, borrado, userName, nombreCompleto, email, imagen, rolId';
    let selectSentence = 'select ? from inscripciones as i inner join alumnos as a on (i.alumnosId = a.id)' +
                                                          'inner join usuarios as u on (a.usuariosId = u.id)';
    
    const whereClause   = getWhereClause(searchByProfesorIdFields, searchConditions, 'i.', `(profesoresId = ${idProfesor}) and (a.borrado = 0)`);
    const orderByClause = getOrderByClause(searchByProfesorIdFields, orderByConditions, 'i.');
    const limitClause   = getLimitClause(limit, page);

    return Promise.all([
            executeQuery(selectSentence.replace('?', fieldsResult) + whereClause + orderByClause + limitClause, []),
            limit ? executeQueryOne(selectSentence.replace('?', getPagesCountClause(limit)) + whereClause, [])
                  : { pages: 1 }
    ]);
}

const searchByAlumnoIdFields = [ 'id', 'estado', 'puntuacion', 'comentario', 'fechaPuntuacion', 'alumnosId', 'profesoresId', 
                                 'userName', 'nombreCompleto', 'email', 'imagen', 'rolId', 'descripcion', 'precioHora', 'experiencia', 
                                 'telefono', 'validado', 'puntuacionMedia', 'puntuacionTotal', 'numeroPuntuaciones',
                                 'ramaId', 'rolId', 'nombreRama'];
const searchInscripcionesByAlumnoId = ({ searchConditions, orderByConditions}, idAlumno, page, limit) => {    
    const fieldsResult = 'i.id, estado, puntuacion, comentario, fechaPuntuacion, alumnosId, profesoresId, userName, nombreCompleto, email, imagen, rolId, ' +
                         'descripcion, precioHora, experiencia, telefono, validado, puntuacionMedia, puntuacionTotal, ' +
                         'numeroPuntuaciones, ramaId, rolId, nombre as nombreRama';
    let selectSentence = 'select ? from inscripciones as i inner join profesores as p on (i.profesoresId = p.id)' +
                                                          'inner join usuarios as u on (p.usuarioId = u.id)' +
                                                          'inner join ramas as r on (p.ramaId = r.id)';
    
    const whereClause   = getWhereClause(searchByAlumnoIdFields, searchConditions, 'i.', `(alumnosId = ${idAlumno}) and (p.validado = 1)`);
    const orderByClause = getOrderByClause(searchByAlumnoIdFields, orderByConditions, 'i.');
    const limitClause   = getLimitClause(limit, page);

    return Promise.all([
            executeQuery(selectSentence.replace('?', fieldsResult) + whereClause + orderByClause + limitClause, []),
            limit ? executeQueryOne(selectSentence.replace('?', getPagesCountClause(limit)) + whereClause, [])
                  : { pages: 1 }
    ]);
}

module.exports = { create, accept, getById, opinionTrans, searchOpiniones, searchOpinionesFields,
                   searchInscripcionesByProfesorId, searchByProfesorIdFields, searchInscripcionesByAlumnoId, 
                   searchByAlumnoIdFields, getByAlumnoIdProfesorId};