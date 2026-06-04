const stopTurnTimer = require("./stopTurnTimer");

function clearTimers(room) {
    if (!room) return;

    stopTurnTimer(room);

    clearInterval(room.prepTimer);

    room.prepTimer = null;
}

module.exports = clearTimers;
