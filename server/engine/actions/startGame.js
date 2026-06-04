const { emitRoomState } = require("../../emitters/emitRoomState");

const { getFirstPlayer } = require("../rules/getFirstPlayer");

const { createContext } = require("../context");

const handleWin = require("./handleWin");

const dealCards = require("../setup/dealCards");

const checkInstantWin = require("../setup/checkInstantWin");

const startTurnPhase = require("../flow/startTurnPhase");

const { getRoom } = require("../../managers/roomManager");

function startGame(io, roomId) {
    const room = getRoom(roomId);

    if (!room) return;

    const players = Object.keys(room.players);

    if (room.restartTimeout) {
        clearTimeout(room.restartTimeout);
        room.restartTimeout = null;
    }

    room.inGamePlayers = [...players];

    room.hands = {};

    room.currentCards = null;

    room.passCount = 0;

    room.passedPlayers = [];

    room.currentChop = null;

    room.declareWinner = null;

    room.gameStarted = true;

    room.gameOver = false;

    room.turn = null;

    if (room.inGamePlayers.length < 2) {
        room.gameStarted = false;

        room.lastPlayer = null;

        emitRoomState(io, room);

        return;
    }

    // Deal exactly 13/10 cards to each player
    dealCards(room);

    io.to(roomId).emit("deal_cards");

    // Sync private hands securely to each socket
    room.inGamePlayers.forEach((playerId) => {
        const socketId = room.players[playerId].socketId;

        io.to(socketId).emit(
            "your_hand",
            room.hands[playerId].map((card) => card.raw),
        );
    });

    // Check for instant win conditions
    const winner = checkInstantWin(room);

    if (winner) {
        const userId = winner.player;

        room.lastPlayer = winner.player;

        room.currentCards = room.hands[userId];

        room.hands[userId] = [];

        const socketId = room.players[userId].socketId;

        io.to(socketId).emit("your_hand", []);

        emitRoomState(io, room);

        handleWin(io, roomId, startGame, winner.player, winner.reason);

        return;
    }

    // Start new game
    setTimeout(() => {
        startTurnPhase(io, room, roomId);
    }, 1600);

    emitRoomState(io, room);
}

module.exports = startGame;
