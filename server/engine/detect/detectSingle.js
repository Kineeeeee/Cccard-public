function detectSingle(cards) {
    if (cards.length !== 1) return null;

    return {
        type: "SINGLE",
        rank: cards[0].rankValue,
        suit: cards[0].suitValue,
        size: 1,
    };
}

module.exports = detectSingle;
