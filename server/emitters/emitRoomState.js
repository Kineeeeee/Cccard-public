const { serializeRoomState } = require("./serializers/serializeRoomState");

function emitRoomState(io, room) {
    io.to(room.id).emit("room_state_update", serializeRoomState(room));
}

module.exports = {
    emitRoomState,
};
