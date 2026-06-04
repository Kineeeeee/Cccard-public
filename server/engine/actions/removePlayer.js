const { emitRoomState } = require("../../emitters/emitRoomState");

const {
    getRoom,
    deleteRoom,
    removePlayerRoom,
} = require("../../managers/roomManager");

function removePlayer(io, roomId, userId) {
    const room = getRoom(roomId);
    if (!room) return;

    const player = room.players[userId];
    if (!player) return;

    const wasHost = room.host === userId;

    // Lobby player leaving
    io.to(roomId).emit("user_left", player.name);

    delete room.players[userId];
    delete room.hands[userId];
    removePlayerRoom(userId);

    if (room.inGamePlayers) {
        room.inGamePlayers = room.inGamePlayers.filter(id => id !== userId);
    }
    if (room.passedPlayers) {
        room.passedPlayers = room.passedPlayers.filter(id => id !== userId);
    }

    const remainingPlayers = Object.keys(room.players);

    // if no more player, delete room
    if (remainingPlayers.length === 0) {
        clearInterval(room.turnTimer);
        clearInterval(room.prepTimer);
        clearTimeout(room.restartTimeout);
        deleteRoom(roomId);
        return;
    }

    // if only 1 player left, end game
    if (remainingPlayers.length < 2) {
        if (room.restartTimeout) {
            clearTimeout(room.restartTimeout);
            room.restartTimeout = null;
        }
        room.gameStarted = false;
        room.gameOver = false;
    }

    if (wasHost) {
        room.host = remainingPlayers[0];

        io.to(roomId).emit("host_changed", room.players[room.host].name);
    }

    emitRoomState(io, room);

    return true;
}

module.exports = removePlayer;
