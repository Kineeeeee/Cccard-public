function createContext(room, userId = null) {
    return {
        room,

        roomId: room.id,

        settings: room.settings || {},

        players: room.players,

        hands: room.hands,

        currentCards: room.currentCards,

        turn: room.turn,

        lastPlayer: room.lastPlayer,

        inGamePlayers: room.inGamePlayers,

        passedPlayers: room.passedPlayers,

        userId,
    };
}

module.exports = {
    createContext,
};
