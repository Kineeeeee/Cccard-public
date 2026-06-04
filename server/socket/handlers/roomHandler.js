const startGame = require("../../../server/engine/actions/startGame");
const startMatch = require("../../../server/engine/actions/startMatch");
const pauseGame = require("../../../server/engine/actions/pauseGame");
const kickPlayer = require("../../../server/engine/actions/kickPlayer");
const removePlayer = require("../../../server/engine/actions/removePlayer");
const createRoom = require("../../../server/engine/actions/createRoom");
const joinRoom = require("../../../server/engine/actions/joinRoom");
const updateSettings = require("../../../server/engine/actions/updateSettings");
const disconnectPlayer = require("../../../server/engine/actions/disconnectPlayer");
const reconnectPlayer = require("../../../server/engine/actions/reconnectPlayer");
const quitGame = require("../../../server/engine/actions/quitGame");

const { emitRoomState } = require("../../emitters/emitRoomState");

const { getRoom } = require("../../managers/roomManager");

module.exports = (io, socket) => {
    socket.on("create_room", ({ userId, name }) => {
        const roomId = createRoom(socket.id, userId, name);

        if (!roomId) return;

        const room = getRoom(roomId);

        socket.join(roomId);

        io.to(roomId).emit("user_joined", room.players[userId].name);

        socket.emit("room_created", roomId);

        emitRoomState(io, room);
    });

    socket.on("join_room", ({ roomId, userId, name }) => {
        const result = joinRoom(io, roomId, socket.id, userId, name);

        if (!result) return;

        const room = getRoom(roomId);

        socket.join(roomId);

        socket.emit(
            "your_hand",
            (room.hands[userId] || []).map((card) => card.raw),
        );

        emitRoomState(io, room);
    });

    socket.on("leave_room", ({ roomId, userId }) => {
        const room = getRoom(roomId);
        let removed = false;

        if (room && room.gameStarted && room.inGamePlayers.includes(userId)) {
            removed = quitGame(io, roomId, userId);
        } else {
            removed = removePlayer(io, roomId, userId);
        }

        if (!removed) return;

        socket.leave(roomId);
    });

    socket.on("pause_game", ({ roomId, userId }) => {
        pauseGame(io, roomId, userId);
    });

    socket.on("start_game", ({ roomId, userId }) => {
        startMatch(io, roomId, userId);
    });

    socket.on("kick_player", ({ roomId, userId, targetId }) => {
        kickPlayer(io, roomId, userId, targetId);
    });

    socket.on("update_settings", ({ roomId, userId, settings }) => {
        updateSettings(io, roomId, userId, settings);
    });

    socket.on("disconnect", () => {
        disconnectPlayer(io, socket.id);
    });

    socket.on("reconnect_player", ({ userId }) => {
        reconnectPlayer(io, socket, userId);
    });
};
