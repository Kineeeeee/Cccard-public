const { emitRoomState } = require("../../emitters/emitRoomState");

const {
    getRoom,

    getPlayerRoom,
} = require("../../managers/roomManager");

function reconnectPlayer(io, socket, userId) {
    const roomId = getPlayerRoom(userId);

    if (!roomId) return;

    const room = getRoom(roomId);

    if (!room) return;

    const player = room.players[userId];

    if (!player) return;

    // Cannot rejoin after quitting
    if (player.quitting) return;

    // Prevent double-reconnects
    if (player.connected) return;

    // Rebind the new socket ID to the existing player session
    player.socketId = socket.id;

    player.connected = true;

    player.disconnectedAt = null;

    io.to(roomId).emit("player_reconnected", player.name);

    socket.join(roomId);

    socket.emit("reconnected", roomId);

    socket.emit(
        "your_hand",
        (room.hands[userId] || []).map((card) => card.raw),
    );

    emitRoomState(io, room);
}

module.exports = reconnectPlayer;
