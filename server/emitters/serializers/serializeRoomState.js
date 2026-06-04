function serializeRoomState(room) {
    return {
        players: Object.values(room.players).map((player) => ({
            userId: player.userId,

            name: player.name,

            cardsLeft: room.hands[player.userId]?.length || 0,

            inGame: room.inGamePlayers?.includes(player.userId),

            connected: player.connected,

            score: player.score,

            wins: player.wins,
        })),

        turn: room.turn,

        settings: room.settings,

        host: room.host,

        currentCards: room.currentCards,

        passCount: room.passCount,

        passedPlayers: room.passedPlayers,

        gameOver: room.gameOver,

        gameStarted: room.gameStarted,

        paused: room.paused,

        preparing: room.preparing,

        turnTimeLeft: room.turnTimeLeft,

        prepTimeLeft: room.prepTimeLeft,

        declareWinner: room.declareWinner,

        lastPlayer: room.lastPlayer,

        restartTimeout: !!room.restartTimeout,

        currentChop: room.currentChop,
    };
}

module.exports = {
    serializeRoomState,
};
