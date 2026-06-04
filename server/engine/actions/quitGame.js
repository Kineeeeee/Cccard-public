const { emitRoomState } = require("../../emitters/emitRoomState");
const { createContext } = require("../context");
const { getRoom, removePlayerRoom } = require("../../managers/roomManager");
const stopTurnTimer = require("../../timers/stopTurnTimer");
const passTurn = require("./passTurn");

function quitGame(io, roomId, userId) {
    const room = getRoom(roomId);
    if (!room) return false;

    const ctx = createContext(room, userId);
    const player = ctx.players[ctx.userId];
    if (!player) return false;

    const wasCurrentTurn = ctx.turn === ctx.userId;

    player.quitting = true;
    player.connected = false;

    io.to(roomId).emit("player_disconnected", player.name);

    // Release player room mapping immediately so they can join/create other rooms
    removePlayerRoom(userId);

    // if the quit player is current player, pass turn to next player
    if (wasCurrentTurn) {
        stopTurnTimer(room);
        passTurn(io, room, roomId, userId, true);
    } else {
        emitRoomState(io, room);
    }

    return true;
}

module.exports = quitGame;
