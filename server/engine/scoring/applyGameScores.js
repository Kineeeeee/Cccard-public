const { calculatePenalty } = require("./calculatePenalty");
const { createContext } = require("../context");
function applyGameScores(room, winnerId) {
    let totalGain = 0;

    const ctx = createContext(room, winnerId);

    const changes = [];

    const scoreRules = ctx.settings.scoring;

    for (const userId of ctx.inGamePlayers) {
        if (userId === winnerId) continue;

        const penalty = calculatePenalty(ctx.hands[userId], scoreRules);

        room.players[userId].score -= penalty;

        totalGain += penalty;

        changes.push({
            userId,
            delta: -penalty,
        });
    }

    // winner take all the score loss from other players
    room.players[winnerId].score += totalGain;
    room.players[winnerId].win += 1;

    changes.push({
        userId: winnerId,
        delta: +totalGain,
    });

    return changes;
}

module.exports = { applyGameScores };
