const { sortCards } = require("../../core/sort");

function detectConsPair(cards) {
    cards = sortCards(cards);
    if (cards.length < 6) return null;
    if (cards.length % 2 !== 0) return null;
    if (cards[cards.length - 1].rankValue === 14) return null; // No 2s allowed in consecutive pairs

    for (let i = 0; i < cards.length; i += 2) {
        if (cards[i].rankValue !== cards[i + 1].rankValue) return null;
        if (i < cards.length - 2) {
            if (cards[i + 2].rankValue !== cards[i].rankValue + 1) return null;
        }
    }

    return {
        type: "CONS_PAIR",
        rank: cards[cards.length - 1].rankValue,
        suit: cards[cards.length - 1].suitValue,
        size: cards.length,
    };
}

module.exports = detectConsPair;
