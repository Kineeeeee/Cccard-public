function compareCombos(comboA, comboB, ctx) {
    if (!comboB) return true;

    // A combo can only beat another combo of the exact same type (except special rules)
    if (comboA.type !== comboB.type) return false;

    // A combo must have the same number of cards (e.g. 5-card straight cannot beat 6-card straight)
    if (comboA.size && comboB.size && comboA.size !== comboB.size) {
        return false;
    }

    // If the ranks of the highest card are identical, tie-break using suits
    if (comboA.rank === comboB.rank) {
        if (!ctx.settings.rules.compareSuit) {
            return false;
        }
        return comboA.suit >= comboB.suit;
    }
    return comboA.rank >= comboB.rank;
}

module.exports = { compareCombos };
