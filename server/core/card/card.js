const rankOrder = [
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
const suitOrder = ["♠", "♣", "♦", "♥"];

// function getRank(card) {
//     return card.slice(0, -1);
// }

// function getRankValue(card) {
//     return rankOrder.indexOf(getRank(card)) + 2;
// }

// function getSuit(card) {
//     return card.slice(-1);
// }

// function getSuitValue(card) {
//     return suitOrder.indexOf(getSuit(card));
// }

function parseCard(card) {
    if (typeof card !== "string") {
        return card;
    }
    const rank = card.slice(0, -1);
    const suit = card.slice(-1);

    return {
        raw: card,
        rankValue: rankOrder.indexOf(rank) + 2,
        suitValue: suitOrder.indexOf(suit),
    };
}
module.exports = { parseCard };
