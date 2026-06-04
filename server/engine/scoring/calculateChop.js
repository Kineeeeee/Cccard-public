function isChopTarget(combo) {
    if (!combo) return false;
    if (combo.type === "SINGLE" && combo.rank === 14) return true;
    if (combo.type === "PAIR" && combo.rank === 14) return true;
    if (combo.type === "CONS_PAIR") return true;
    if (combo.type === "QUAD") return true;
    return false;
}

function getChopPenalty(combo, scoring) {
    if (combo.type === "SINGLE" && combo.rank === 14) return scoring.chopPen;
    if (combo.type === "PAIR" && combo.rank === 14) return scoring.chopPen * 2;
    if (combo.type === "CONS_PAIR")
        return scoring.chopPen * (combo.size >= 8 ? 2 : 1);
    if (combo.type === "QUAD") return scoring.chopPen * 2;
    return 0;
}

module.exports = { isChopTarget, getChopPenalty };
