const { Server } = require("socket.io");

let io = null;
let logSocket = null;

const initLogs = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",  // Permet à toutes les origines d'accéder au serveur WebSocket
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        logSocket = socket;
        log("Client connecté pour suivre les logs.");
        socket.on("disconnect", () => {
            log("Client déconnecté.");
            logSocket = null;
        });
    });
};

const log = (message) => {
    console.log(message); // Affiche dans la console Node.js
    if (logSocket) logSocket.emit("log", message); // Envoie via WebSocket
};

module.exports = { log, initLogs };
