const {
    getRoom,

    setPlayerRoom,

    getPlayerRoom,
} = require("../../managers/roomManager");

function joinRoom(io, roomId, socketId, userId, name) {
    if (getPlayerRoom(userId)) return;

    const room = getRoom(roomId);

    if (!room) return false;

    if (room.players[userId]) return false;

    // Allow max 4 players
    if (Object.keys(room.players).length >= 4) {
        return "full";
    }

    // Sanitize and limit name length
    name = (name || `Player ${Object.keys(room.players).length + 1}`)
        .trim()
        .slice(0, 12);

    room.players[userId] = {
        userId,

        socketId,

        name,

        connected: true,

        disconnectedAt: null,

        score: 0,

        wins: 0,
    };

    setPlayerRoom(userId, roomId);

    io.to(roomId).emit("user_joined", name);

    return true;
}

module.exports = joinRoom;
