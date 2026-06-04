const {
    hasDragonStraight,
    hasFullPairs,
    hasFourTwos,
    hasNoFaces,
    hasSameColour,
} = require("./winPatterns");
// Evaluates the initial 13-card hand to determine if the player wins instantly
function checkStartWin(hand) {
    if (hasDragonStraight(hand)) return "DRAGON"; // (3 to 2)
    if (hasFullPairs(hand)) return "FULL_PAIR";   // 6 pairs for 13 and 5 pairs for 10
    if (hasFourTwos(hand)) return "FOUR_TWOS";    // four cards of 2
    if (hasNoFaces(hand)) return "POOR";          // cards from 3 to 10 only
    if (hasSameColour(hand)) return "FULL_COLOUR";// Only red/black cards
    return null;
}

module.exports = { checkStartWin };
