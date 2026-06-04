const { checkStartWin } = require("../win/checkStartWin");

function checkInstantWin(room) {
    let winner = null;

    for (const playerId of room.inGamePlayers) {
        const hand = room.hands[playerId];

        const winType = checkStartWin(hand);

        if (winType && !winner) {
            winner = {
                player: playerId,
                reason: winType,
            };
        }
    }

    return winner;
}

module.exports = checkInstantWin;
