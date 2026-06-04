function hasDragonStraight(hand) {
    const sorted = [...hand].sort((a, b) => a.rankValue - b.rankValue);

    for (let i = 0; i < sorted.length - 1; i++) {
        if (sorted[i].rankValue + 1 !== sorted[i + 1].rankValue) {
            return false;
        }
    }

    return true;
}

function hasFullPairs(hand) {
    const sorted = [...hand].sort((a, b) => a.rankValue - b.rankValue);
    let num = 0;
    for (let i = 0; i < sorted.length - 1; i = i + 1) {
        if (sorted[i].rankValue === sorted[i + 1].rankValue) {
            i++;
            num++;
        }
    }

    return num === Math.floor(hand.length / 2);
}

function hasFourTwos(hand) {
    return hand.filter((c) => c.rankValue === 14).length === 4;
}

function hasNoFaces(hand) {
    return hand.filter((c) => c.rankValue < 10).length === hand.length;
}

function hasSameColour(hand) {
    return (
        hand.filter((c) => c.suitValue < 2).length === hand.length ||
        hand.filter((c) => c.suitValue >= 2).length === hand.length
    );
}

module.exports = {
    hasDragonStraight,
    hasFullPairs,
    hasFourTwos,
    hasNoFaces,
    hasSameColour,
};
