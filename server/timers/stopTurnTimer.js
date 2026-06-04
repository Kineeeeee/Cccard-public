function stopTurnTimer(room) {
    if (!room) {
        return;
    }

    if (room.turnTimer) {
        clearInterval(room.turnTimer);

        room.turnTimer = null;
    }

    room.turnTimeLeft = 0;
}

module.exports = stopTurnTimer;
