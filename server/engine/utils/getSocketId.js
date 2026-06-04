function getSocketId(room, userId) {
    return room.players[userId]?.socketId;
}

module.exports = getSocketId;
