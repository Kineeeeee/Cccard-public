const stopTurnTimer = require("./stopTurnTimer");

function startTurnTimer(io, room, onTimeout) {
    if (!room || !room.id) {
        return;
    }

    // clear timer before adding new one
    stopTurnTimer(room);

    // auto pass for quitting player
    if (room.players[room.turn] && room.players[room.turn].quitting) {
        setTimeout(() => {
            if (typeof onTimeout === "function") {
                onTimeout();
            }
        }, 500);
        return;
    }

    const turnTime = room.settings?.timers?.turnTime ?? 15;
    room.turnTimeLeft = turnTime;

    io.to(room.id).emit("turn_timer_started", {
        player: room.turn,
        timeLeft: room.turnTimeLeft,
    });

    room.turnTimer = setInterval(() => {
        if (!room || !room.id) {
            if (room && room.turnTimer) {
                clearInterval(room.turnTimer);

                room.turnTimer = null;
            }

            return;
        }

        if (room.paused) {
            return;
        }

        room.turnTimeLeft--;

        io.to(room.id).emit("turn_timer_update", {
            player: room.turn,
            timeLeft: room.turnTimeLeft,
        });

        if (room.turnTimeLeft <= 0) {
            stopTurnTimer(room);

            setImmediate(() => {
                if (typeof onTimeout === "function") {
                    onTimeout();
                }
            });
        }
    }, 1000);
}

module.exports = startTurnTimer;
