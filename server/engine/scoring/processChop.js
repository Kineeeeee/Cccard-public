const { isChopTarget, getChopPenalty } = require("./calculateChop");
const { getCombo } = require("../detect/getCombo");

function processChop(room, chopperId, currentCombo) {
    const last = room.currentCards ? getCombo(room.currentCards) : null;

    if (isChopTarget(last)) {
        if (currentCombo.type === "PAIR" || currentCombo.type === "SINGLE") {
            return;
        }

        const targetPenalty = getChopPenalty(last, room.settings.scoring);

        if (!room.currentChop) {
            room.currentChop = {
                accumulatedAmount: targetPenalty,
                victim: room.lastPlayer,
                chopper: chopperId,
            };
        } else {
            room.currentChop.accumulatedAmount += targetPenalty;
            room.currentChop.victim = room.lastPlayer;
            room.currentChop.chopper = chopperId;
        }
    }
}

module.exports = processChop;
