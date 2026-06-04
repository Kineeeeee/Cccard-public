function startPrepPhase(io, room, onFinish) {
    if (!room) {
        return;
    }

    // clear timer before adding new one
    if (room.prepTimer) {
        clearInterval(room.prepTimer);
    }

    room.preparing = true;

    // Use settings or fallback to 10
    const prepTime = room.settings?.timers?.prepTime ?? 10;
    room.prepTimeLeft = prepTime;

    io.to(room.id).emit("prep_started", room.prepTimeLeft);

    room.prepTimer = setInterval(() => {
        if (room.paused) {
            return;
        }

        room.prepTimeLeft--;

        io.to(room.id).emit("prep_timer_update", room.prepTimeLeft);

        if (room.prepTimeLeft <= 0) {
            clearInterval(room.prepTimer);

            room.prepTimer = null;

            room.preparing = false;

            onFinish?.();
        }
    }, 1000);
}

module.exports = startPrepPhase;
