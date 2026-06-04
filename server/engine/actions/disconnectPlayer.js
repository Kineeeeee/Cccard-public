const { emitRoomState } = require("../../emitters/emitRoomState");

const { getRooms } = require("../../managers/roomManager");

function disconnectPlayer(io, socketId) {
    const rooms = getRooms();

    for (const roomId of Object.keys(rooms)) {
        const room = rooms[roomId];

        const player = Object.values(room.players).find(
            (p) => p.socketId === socketId,
        );

        if (!player) continue;

        player.disconnectedAt = Date.now();

        player.connected = false;

        io.to(roomId).emit("player_disconnected", player.name);

        emitRoomState(io, room);
    }
}

module.exports = disconnectPlayer;
