const dayjs = require('dayjs');
const { executeQueryOne, executeQuery, executeQueryTrans, beginTransaction, commit, rollBack } = require('../helpers/mysql_utils');
const { createTransConversacion, getByProfesorIdAlumnoIdTrans, undeleteTrans, deleteTransConversacionAlumno, deleteTransConversacionProfesor } = require('./conversaciones.model');
const { getCompleteAlumnoById } = require('./alumnos.model');
const { getCompleteProfesorById } = require('./profesores.model');

const key_columns    = 'id';
const no_key_columns = 'autor, destinatario, texto, fechaHora, leido, borradoProfesor, borradoAlumno, conversacionesId';
const columns        = `${key_columns}, ${no_key_columns}`;

const createTransMensaje = (db, autor, destinatario, texto, converacionesId) => {    
    return executeQueryTrans(
        db,
        `insert into mensajes (${no_key_columns}) values (?, ?, ?, ?, ?, ?, ?, ?)`, 
        [ autor, destinatario, texto, dayjs().format('YYYY-MM-DD HH:mm:ss'), 0, 0, 0, converacionesId]
    );
}

const getById = (id) => {
    return executeQueryOne(
        `select ${columns} from mensajes where (id = ?)`, 
        [ id ]
    );
}

const create = async (profesoresId, alumnosId, autor, destinatario, texto) => {
    const db = await beginTransaction();
    let idMensaje;
    try {
        const conversacion = await getByProfesorIdAlumnoIdTrans(db, profesoresId, alumnosId);

        let conversacionId;
        if (conversacion === null) {
            conversacionId = (await createTransConversacion(db, profesoresId, alumnosId)).insertId;
        } else {
            conversacionId = conversacion.id;
            await undeleteTrans(db, conversacion.id);
        }

        idMensaje = (await createTransMensaje(db, autor, destinatario, texto, conversacionId)).insertId;

        await commit(db);
    } catch(exception) {
        await rollBack(db);
        throw exception;
    }
    
    return (await getById(idMensaje));
}

const setLeido = (id, destinatario) => {
    return executeQuery(
        'update mensajes set leido=1 where (id = ?) and (destinatario = ?)', 
        [ id, destinatario ]
    );
}

const deleteMensajeAlumno = (id, alumnoId) => {
    return executeQuery(
        'update mensajes set borradoAlumno=1 where (id = ?) and ((autor = ?) or (destinatario = ?))', 
        [ id, alumnoId, alumnoId ]
    );
}

const deleteTransMensajesConversacionAlumno = (db, idConversacion, alumnoId) => {
    return executeQueryTrans(
        db,
        'update mensajes set borradoAlumno=1 where (conversacionesId = ?) and ((autor = ?) or (destinatario = ?))', 
        [ idConversacion, alumnoId, alumnoId ]
    );
}

const deleteConversacionAlumno = async (id, alumnosId) => {
    const db = await beginTransaction();
    let result;
    try {
        await deleteTransMensajesConversacionAlumno(db, id, alumnosId);
        result = await deleteTransConversacionAlumno(db, id, alumnosId);

        await commit(db);
    } catch(exception) {
        await rollBack(db);
        throw exception;
    }
    
    return result;
}

const deleteMensajeProfesor = (id, profesorId) => {
    return executeQuery(
        'update mensajes set borradoProfesor=1 where (id = ?) and ((autor = ?) or (destinatario = ?))', 
        [ id, profesorId, profesorId ]
    );
}

const deleteTransMensajesConversacionProfesor = (db, idConversacion, profesorId) => {
    return executeQueryTrans(
        db,
        'update mensajes set borradoProfesor=1 where (conversacionesId = ?) and ((autor = ?) or (destinatario = ?))', 
        [ idConversacion, profesorId, profesorId ]
    );
}

const deleteConversacionProfesor = async (id, profesoresId) => {
    const db = await beginTransaction();
    let result;
    try {
        await deleteTransMensajesConversacionProfesor(db, id, profesoresId);
        result = await deleteTransConversacionProfesor(db, id, profesoresId);

        await commit(db);
    } catch(exception) {
        await rollBack(db);
        throw exception;
    }
    
    return result;
}

const getMensajes = async (profesorId, alumnoId) => {
    let whereClause, profesorAlumnoId, getInterlocutor;
    if (profesorId !== null) {
        whereClause      = `(profesoresId = ${profesorId}) and (borradaProfesor = 0) and (borradoProfesor = 0)`;
        profesorAlumnoId = profesorId;
        getInterlocutor  = getCompleteAlumnoById;
    } else {
        whereClause      = `(alumnosId = ${alumnoId}) and (borradaAlumno = 0) and (borradoAlumno = 0)`;
        profesorAlumnoId = alumnoId;
        getInterlocutor  = getCompleteProfesorById;
    }

    const mensajes = await executeQuery(
        `select m.id, ${no_key_columns} from mensajes as m inner join conversaciones as c on (conversacionesId = c.id) where ${whereClause} order by conversacionesId, m.id`, 
        []
    )

    const mensajesAgrupados = mensajes.reduce(
        (acc, mensaje) => {
            const interLocutorId = (mensaje.autor === profesorAlumnoId) ? mensaje.destinatario : mensaje.autor;
            const noLeido        = !mensaje.leido && (mensaje.destinatario === profesorAlumnoId);

            if (noLeido) {
                acc.mensajesNoLeidos++;
            }

            if (acc.conversaciones.has(mensaje.conversacionesId)) {
                let conversacion = acc.conversaciones.get(mensaje.conversacionesId);
                conversacion.mensajes.push(mensaje);
                if (noLeido) {
                    conversacion.mensajesNoLeidos++;
                }
                const fechaHora = dayjs(mensaje.fechaHora);
                if (conversacion.ultimaFechaHora.isBefore(fechaHora)) {
                    conversacion.ultimaFechaHora = fechaHora;
                }
            } else {
                acc.conversaciones.set(
                    mensaje.conversacionesId,
                    {
                        conversacionesId: mensaje.conversacionesId,
                        mensajesNoLeidos: noLeido ? 1 : 0,
                        ultimaFechaHora: dayjs(mensaje.fechaHora),
                        interlocutor: interLocutorId,
                        mensajes: [mensaje]
                    }
                );
            }

            return acc;
        },
        {
            mensajesNoLeidos: 0,
            conversaciones: new Map()
        }
    );    

    // Nos quedamos con los valores del Map, la clave ya no nos hace falta.
    mensajesAgrupados.conversaciones = [...mensajesAgrupados.conversaciones.values()];

    // Ordenamos las conversaciones (primero las que tengan el último mensaje más reciente)
    mensajesAgrupados.conversaciones.sort(
        (conversacion1, conversacion2) => {
            if (conversacion1.ultimaFechaHora.isBefore(conversacion2.ultimaFechaHora)) {
                return 1;
            } else if (conversacion2.ultimaFechaHora.isBefore(conversacion1.ultimaFechaHora)){
                return -1;
            } else {
                return 0;
            }
        }
    );

    // Recuperamos todos los datos del interlocutor a partir de su id.
    mensajesAgrupados.conversaciones = await Promise.all(
        mensajesAgrupados.conversaciones.map(
            async (conversacion) => {
                conversacion.interlocutor = await getInterlocutor(conversacion.interlocutor);
                return conversacion;
            }
        )
    );

    return mensajesAgrupados;
}

module.exports = { create, getMensajes, setLeido, deleteMensajeAlumno, deleteMensajeProfesor, deleteConversacionAlumno, deleteConversacionProfesor };