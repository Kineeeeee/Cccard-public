function emitHand(io, room, userId) {
    const socketId = room.players[userId].socketId;

    io.to(socketId).emit(
        "your_hand",
        room.hands[userId].map((c) => c.raw),
    );
}

module.exports = emitHand;
