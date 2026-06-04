function getFirstPlayer(ctx) {
    if (ctx.room && ctx.room.declareWinner) {
        return ctx.room.declareWinner;
    }

    const mode = ctx.settings.rules.firstTurnMode;

    switch (mode) {
        case "random":
            return getRandomPlayer(ctx);

        case "winner":
            if (ctx.lastPlayer) {
                return ctx.lastPlayer;
            }

            return getRandomPlayer(ctx);

        case "3_spade":
            return getPlayerWith3Spade(ctx);

        default:
            return getRandomPlayer(ctx);
    }
}

// get random player
function getRandomPlayer(ctx) {
    const players = ctx.inGamePlayers;

    const randomIndex = Math.floor(Math.random() * players.length);

    return players[randomIndex];
}

// get player having 3 spade
function getPlayerWith3Spade(ctx) {
    for (let playerId of ctx.inGamePlayers) {
        const hand = ctx.hands[playerId];

        const has3Spade = hand.some(
            (card) => card.rankValue === 1 && card.suitValue === 0,
        );

        if (has3Spade) {
            return playerId;
        }
    }

    return getRandomPlayer(ctx);
}

module.exports = {
    getFirstPlayer,
};
