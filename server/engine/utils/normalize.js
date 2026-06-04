const { parseCard } = require("../../core/card/card");

function normalizeCards(cards) {
    return cards.map((c) => (typeof c === "string" ? parseCard(c) : c));
}

module.exports = { normalizeCards };
