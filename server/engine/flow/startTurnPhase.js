const passTurn = require("../actions/passTurn");

const startPrepPhase = require("../../timers/startPrepPhase");

const startTurnTimer = require("../../timers/startTurnTimer");

const { emitRoomState } = require("../../emitters/emitRoomState");

const { getFirstPlayer } = require("../rules/getFirstPlayer");
const { createContext } = require("../context");

function startTurnPhase(io, room, roomId) {
    startPrepPhase(io, room, () => {
        const ctx = createContext(room);
        room.turn = getFirstPlayer(ctx);

        io.to(roomId).emit("game_started", {
            turn: room.turn,
        });

        startTurnTimer(io, room, () => {
            const timedOutPlayer = room.turn;

            passTurn(io, room, roomId, timedOutPlayer, true);
        });

        emitRoomState(io, room);
    });
}

module.exports = startTurnPhase;
