const { createDeck, shuffle } = require("../../deck");

const { normalizeCards } = require("../utils/normalize");

const { sortCards } = require("../../core/sort");

function dealCards(room) {
    const deck = createDeck();

    shuffle(deck);

    const numOfCards = room.settings.rules.cardsPerPlayer;

    room.inGamePlayers.forEach((playerId, i) => {
        const rawHand = deck.slice(i * numOfCards, (i + 1) * numOfCards);

        room.hands[playerId] = normalizeCards(rawHand);
    });
}

module.exports = dealCards;
