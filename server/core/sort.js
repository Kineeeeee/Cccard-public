function sortCards(cards) {
    return [...cards].sort((a, b) => {
        if (a.rankValue !== b.rankValue) {
            return a.rankValue - b.rankValue;
        }
        return a.suitValue - b.suitValue;
    });
}

module.exports = { sortCards };
