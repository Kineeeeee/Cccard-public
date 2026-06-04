const { getRoom } = require("../../managers/roomManager");
const { emitRoomState } = require("../../emitters/emitRoomState");

module.exports = (io, socket) => {
    socket.on("declare", ({ roomId, userId }) => {
        const room = getRoom(roomId);
        if (!room) return;
        if (!room.inGamePlayers.includes(userId)) return;

        // Only allow declare if game is preparing and no one has declared yet
        if (!room.preparing) return;
        if (room.declareWinner) return;

        room.declareWinner = userId;

        const playerName = room.players[userId]?.name || userId;
        io.to(roomId).emit("player_declared", {
            playerName,
        });

        emitRoomState(io, room);
    });
};
