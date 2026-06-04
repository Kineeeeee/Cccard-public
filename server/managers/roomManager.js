const rooms = {};
const userRoomMap = {};

function createRoom(roomId, room) {
    rooms[roomId] = room;
}

function getRooms() {
    return rooms;
}

function getRoom(roomId) {
    return rooms[roomId];
}

function deleteRoom(roomId) {
    delete rooms[roomId];
}

function setPlayerRoom(userId, roomId) {
    userRoomMap[userId] = roomId;
}

function getPlayerRoom(userId) {
    return userRoomMap[userId];
}

function removePlayerRoom(userId) {
    delete userRoomMap[userId];
}

module.exports = {
    createRoom,
    getRooms,
    getRoom,
    deleteRoom,

    setPlayerRoom,
    getPlayerRoom,
    removePlayerRoom,
};
