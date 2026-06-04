const { sortCards } = require("../sort");

function getHighestCard(hand) {
    return sortCards([...hand])[hand.length - 1];
}

module.exports = getHighestCard;
