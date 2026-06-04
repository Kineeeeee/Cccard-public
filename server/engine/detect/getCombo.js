const detectSingle = require("./detectSingle");
const detectPair = require("./detectPair");
const detectTriple = require("./detectTriple");
const detectStraight = require("./detectStraight");
const detectQuad = require("./detectQuad");
const detectConsPair = require("./detectConsPair");

function getCombo(cards) {
    if (!cards || cards.length === 0) {
        return { type: "INVALID" };
    }

    return (
        detectSingle(cards) ||
        detectPair(cards) ||
        detectTriple(cards) ||
        detectStraight(cards) ||
        detectQuad(cards) ||
        detectConsPair(cards) || { type: "INVALID" }
    );
}

module.exports = { getCombo };
