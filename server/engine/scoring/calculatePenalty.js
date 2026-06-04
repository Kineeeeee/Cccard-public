function calculatePenalty(cards, scoreRules) {
    let score = 0;
    const counts = {};

    for (const card of cards) {
        score += scoreRules.normalPen;
        if (card.rankValue === 14) {
            score += scoreRules.twosPen;
        }
        counts[card.rankValue] = (counts[card.rankValue] || 0) + 1;
    }

    let quadCount = 0;
    const pairRanks = [];

    for (const rank in counts) {
        if (counts[rank] === 4) {
            quadCount++;
        }
        if (counts[rank] >= 2) {
            pairRanks.push(Number(rank));
        }
    }

    pairRanks.sort((a, b) => a - b);

    let consPairCount = 0;
    let currentStreak = 1;

    for (let i = 0; i < pairRanks.length - 1; i++) {
        if (pairRanks[i] === 14 || pairRanks[i + 1] === 14) {
            if (currentStreak >= 3) consPairCount++;
            currentStreak = 1;
            continue;
        }

        if (pairRanks[i + 1] === pairRanks[i] + 1) {
            currentStreak++;
        } else {
            if (currentStreak >= 3) consPairCount++;
            currentStreak = 1;
        }
    }

    if (currentStreak >= 3) {
        consPairCount++;
    }

    if (scoreRules.quadPen) {
        score += scoreRules.quadPen * quadCount;
    }
    if (scoreRules.consPairPen) {
        score += scoreRules.consPairPen * consPairCount;
    }

    return score;
}

module.exports = { calculatePenalty };
