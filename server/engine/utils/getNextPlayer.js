function getNextPlayer(ctx) {
    const players = ctx.inGamePlayers;

    if (!players.length) return null;

    let idx = players.indexOf(ctx.userId);

    if (idx === -1) {
        return players[0];
    }

    for (let i = 1; i <= players.length; i++) {
        const next = players[(idx + i) % players.length];
        // not include player who passed
        if (ctx.passedPlayers.includes(next)) {
            continue;
        }

        if (ctx.inGamePlayers.includes(next)) {
            return next;
        }
    }

    return ctx.userId;
}

module.exports = getNextPlayer;
