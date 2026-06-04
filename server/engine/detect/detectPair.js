const { sortCards } = require("../../core/sort");

function detectPair(cards) {
    cards = sortCards(cards);

    if (cards.length !== 2) return null;
    if (cards[0].rankValue !== cards[1].rankValue) return null;

    return {
        type: "DOUBLE",
        rank: cards[1].rankValue,
        suit: cards[1].suitValue,
        size: 2,
    };
}

module.exports = detectPair;
