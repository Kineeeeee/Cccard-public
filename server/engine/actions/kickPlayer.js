const { emitRoomState } = require("../../emitters/emitRoomState");

const {
    getRoom,

    removePlayerRoom,
} = require("../../managers/roomManager");

function kickPlayer(io, roomId, userId, targetId) {
    const room = getRoom(roomId);

    if (!room) return;

    // only host can kick player
    if (room.host !== userId) return;

    // can only kick when game not started
    if (!room.gameOver && room.gameStarted) return;

    const targetPlayer = room.players[targetId];

    if (!targetPlayer) return;

    io.to(targetPlayer.socketId).emit("kicked");

    delete room.players[targetId];

    delete room.hands[targetId];

    removePlayerRoom(targetId);

    room.inGamePlayers = room.inGamePlayers.filter((id) => id !== targetId);

    room.passedPlayers = room.passedPlayers.filter((id) => id !== targetId);

    io.sockets.sockets.get(targetPlayer.socketId)?.leave(roomId);

    io.to(roomId).emit("user_left", targetPlayer.name);

    emitRoomState(io, room);
}

module.exports = kickPlayer;
