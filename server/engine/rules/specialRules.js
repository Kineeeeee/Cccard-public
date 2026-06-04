function canBeat(move, last, settings = {}) {
    if (move.type === "QUAD") {
        if (
            (last.type === "SINGLE" || last.type === "PAIR") &&
            last.rank === 14
        ) {
            return true;
        }
        if (last.type === "CONS_PAIR" && last.size === 6) {
            // Quad beats 3 conspairs
            return true;
        }
    }

    if (
        move.type === "CONS_PAIR" &&
        settings.rules &&
        settings.rules.allowConsecutivePair
    ) {
        if (move.size === 6) {
            // 3 conspair beat single 2
            if (last.type === "SINGLE" && last.rank === 14) return true;
        }
        if (move.size >= 8) {
            // 4 conspair beat single 2, pair 2 or quad
            if (
                (last.type === "SINGLE" || last.type === "PAIR") &&
                last.rank === 14
            )
                return true;
            if (last.type === "QUAD") return true;
        }
    }

    return false;
}

module.exports = { canBeat };
