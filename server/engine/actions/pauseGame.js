const { emitRoomState } = require("../../emitters/emitRoomState");

const { getRoom } = require("../../managers/roomManager");

function pauseGame(io, roomId, userId) {
    const room = getRoom(roomId);

    if (!room) return;

    if (room.host !== userId) {
        return;
    }

    if (!room.gameStarted) {
        return;
    }

    if (room.paused) {
        return;
    }

    room.paused = true;

    if (room.restartTimeout) {
        clearTimeout(room.restartTimeout);

        room.restartTimeout = null;
    }

    io.to(roomId).emit("game_paused");

    emitRoomState(io, room);
}

module.exports = pauseGame;
