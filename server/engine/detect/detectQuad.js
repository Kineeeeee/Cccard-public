function detectQuad(cards) {
    if (cards.length !== 4) return null;

    if (cards[0].rankValue !== cards[1].rankValue) return null;
    if (cards[1].rankValue !== cards[2].rankValue) return null;
    if (cards[2].rankValue !== cards[3].rankValue) return null;

    return {
        type: "QUAD",
        rank: cards[3].rankValue,
        suit: cards[3].suitValue,
        size: 4,
    };
}

module.exports = detectQuad;
