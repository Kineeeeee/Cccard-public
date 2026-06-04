function createDeck() {
    const suits = ["♠", "♥", "♦", "♣"];
    const ranks = [
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "J",
        "Q",
        "K",
        "A",
        "2",
    ];

    let deck = [];

    for (let s of suits) {
        for (let r of ranks) {
            deck.push(r + s);
        }
    }

    return deck;
}

function shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

module.exports = { createDeck, shuffle };
