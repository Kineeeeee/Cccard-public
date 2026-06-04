const { emitRoomState } = require("../../emitters/emitRoomState");

const { createContext } = require("../context");

const getNextPlayer = require("../utils/getNextPlayer");

const startTurnTimer = require("../../timers/startTurnTimer");

const resetRound = require("./resetRound");

function passTurn(io, room, roomId, userId, timedOut = false) {
    if (!room || room.paused) {
        return;
    }

    const ctx = createContext(room, userId);

    if (room.turn !== userId) {
        return;
    }

    // first turn but timed out
    if (!room.currentCards || room.currentCards.length === 0) {
        const nextPlayer = getNextPlayer(ctx);

        room.turn = nextPlayer;
        
        startTurnTimer(io, room, () => {
            // auto pass when timed out
            const timedOutPlayer = room.turn;
            passTurn(io, room, roomId, timedOutPlayer, true);
        });

        emitRoomState(io, room);

        io.to(roomId).emit("player_passed", {
            player: room.players[userId] ? room.players[userId].name : "Unknown",

            turn: room.turn,

            timedOut,

            isNewRound: true,
        });

        return;
    }

    room.passCount++;

    if (!room.passedPlayers.includes(userId)) {
        room.passedPlayers.push(userId);
    }

    const activeInGamePlayers = room.inGamePlayers.length;

    // everyone else except one have passed, start new round
    if (room.passCount >= activeInGamePlayers - 1) {
        let nextTurn = room.lastPlayer;

        if (!nextTurn || !room.inGamePlayers.includes(nextTurn)) {
            nextTurn = room.inGamePlayers[0];
        }

        resetRound(io, room);

        room.turn = nextTurn;

        io.to(roomId).emit("player_passed", {
            player: room.players[userId] ? room.players[userId].name : "Unknown",

            turn: room.turn,

            timedOut,

            isNewRound: true,
        });

        startTurnTimer(io, room, () => {
            // auto pass when timed out
            const timedOutPlayer = room.turn;

            passTurn(io, room, roomId, timedOutPlayer, true);
        });

        emitRoomState(io, room);

        return;
    }

    const nextPlayer = getNextPlayer(ctx);

    room.turn = nextPlayer;

    startTurnTimer(io, room, () => {
        // auto pass when timed out
        const timedOutPlayer = room.turn;
        passTurn(io, room, roomId, timedOutPlayer, true);
    });

    emitRoomState(io, room);

    io.to(roomId).emit("player_passed", {
        player: room.players[userId] ? room.players[userId].name : "Unknown",

        turn: room.turn,

        timedOut,

        isNewRound: false,
    });
}

module.exports = passTurn;
