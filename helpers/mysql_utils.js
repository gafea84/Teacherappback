const mysql = require('mysql2');

const dbPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE
});

const executeQuery = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        dbPool.query(sql, params, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

const executeQueryOne = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        dbPool.query(sql, params, (err, result) => {
            if (err) return reject(err);
            if (result.length === 0) return resolve(null);
            resolve(result[0]);
        });
    });
}


// --> Funciones para transacciones
const beginTransaction = () => {
    return new Promise((resolve, reject) => {
        dbPool.getConnection( (err, connection) => {
            if (err) return reject(err);
            connection.beginTransaction( (err) => {
                if (err) {
                    connection.releaseConnection();
                    reject(err);
                }
                resolve(connection);
            })
        })
    });
}

const executeQueryTrans = (db, sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

const executeQueryOneTrans = (db, sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, result) => {
            if (err) return reject(err);
            if (result.length === 0) return resolve(null);
            resolve(result[0]);
        });
    });
}

const commit = (db) => {
    return new Promise((resolve, reject) => {
        db.commit((err) => {
            if (err) reject(err);
            db.release();
            resolve();
        })
    });
}

const rollBack = (db) => {    
    return new Promise((resolve, reject) => {
        db.rollback((err) => {
            if (err) reject(err);
            db.release();
            resolve();
        })
    });
}

// <-- Funciones para transacciones

module.exports = { executeQuery, executeQueryOne, beginTransaction, executeQueryTrans, executeQueryOneTrans, commit, rollBack };