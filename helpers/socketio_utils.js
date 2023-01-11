const { validateTokenStr } = require('./token_utils');

const usuariosSockets = new Map();

const startSocketIO = (server) => {
    const ioServer = require('socket.io')(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    ioServer.on("connection", (socket) => {
        let userId = null;

        // Esperamos el "login". Mientras no llegue no
        // usaremos el socket.
        socket.on("login", async (token, callback) => {
            const validationResult = await validateTokenStr(token);
            if (validationResult.ok) {
                userId = validationResult.user.id;
                usuariosSockets.set(
                    userId,
                    socket
                );
                return callback({ ok: true  });
            } else {
                return callback({ ok: false });
            }
        });

        socket.on('disconnect', () => {
            if ((userId) && usuariosSockets.has(userId)) {
                usuariosSockets.delete(userId);
            }
        });
    });
}

const nuevoMensaje = (usuarioId, mensaje, autor) =>
{
    if (usuariosSockets.has(usuarioId)) {
        usuariosSockets.get(usuarioId).emit(
            "Nuevo mensaje",
            mensaje,
            autor
        );
    }
}

module.exports = { startSocketIO, nuevoMensaje };