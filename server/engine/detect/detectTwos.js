function detectTwos(cards) {
    if (cards.length > 3) return null;
    if (cards.length < 1) return null;

    for (let i = 0; i < cards.length; i++) {
        if (cards[i].rankValue !== 14) return null;
    }

    return {
        type: "TWOS",
        rank: 14,
        size: cards.length,
    };
}

module.exports = detectTwos;
