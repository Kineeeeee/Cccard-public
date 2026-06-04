const roomHandler = require("./handlers/roomHandler");

const gameHandler = require("./handlers/gameHandler");

const declareHandler = require("./handlers/declareHandler");

module.exports = (io) => {
    io.on("connection", (socket) => {
        roomHandler(io, socket);

        gameHandler(io, socket);

        declareHandler(io, socket);
    });
};
