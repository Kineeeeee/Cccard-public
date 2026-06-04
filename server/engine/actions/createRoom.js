const {
    createRoom: saveRoom,

    getRoom,

    setPlayerRoom,

    getPlayerRoom,
} = require("../../managers/roomManager");

const defaultSettings = require("../../config/defaultSettings");

function createRoom(socketId, userId, name) {
    // Prevent players from creating multiple rooms simultaneously
    if (getPlayerRoom(userId)) return null;

    let roomId;

    // Generate a unique 4-character alphanumeric room code
    do {
        roomId = Math.random().toString(36).substring(2, 6);
    } while (getRoom(roomId));

    name = (name || "Player 1").trim().slice(0, 12);

    // Initialize the master room state object.
    const room = {
        id: roomId,

        host: userId,

        players: {
            [userId]: {
                socketId: socketId,
                userId: userId,
                name,
                connected: true,
                disconnectedAt: null,
                score: 0,
                wins: 0,
            },
        },

        inGamePlayers: [],
        hands: {},

        turn: null,
        currentCards: null,
        lastPlayer: null,

        passCount: 0,

        gameOver: false,
        gameStarted: false,

        paused: false,

        passedPlayers: [],

        settings: structuredClone(defaultSettings),

        restartTimeout: null,

        prepTimeLeft: 0,
        prepTimer: null,

        turnTimeLeft: 0,
        turnTimer: null,

        preparing: false,

        declareWinner: null,

        currentChop: null,
    };

    saveRoom(roomId, room);

    setPlayerRoom(userId, roomId);

    return roomId;
}

module.exports = createRoom;
