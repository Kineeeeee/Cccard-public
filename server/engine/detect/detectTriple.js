function detectTriple(cards) {
    if (cards.length !== 3) return null;

    if (cards[0].rankValue !== cards[1].rankValue) return null;
    if (cards[1].rankValue !== cards[2].rankValue) return null;

    return {
        type: "TRIPLE",
        rank: cards[2].rankValue,
        suit: cards[2].suitValue,
        size: 3,
    };
}

module.exports = detectTriple;
