const { emitRoomState } = require("../../emitters/emitRoomState");

function resetRound(io, room) {
    // calculate chop if possible
    if (room.currentChop) {
        const { accumulatedAmount, victim, chopper } = room.currentChop;
        if (room.players[victim] && room.players[chopper]) {
            room.players[victim].score -= accumulatedAmount;
            room.players[chopper].score += accumulatedAmount;

            io.to(room.id).emit("score_update", {
                changes: [
                    { userId: victim, delta: -accumulatedAmount },
                    { userId: chopper, delta: accumulatedAmount },
                ],
            });
        }
        room.currentChop = null;
    }

    room.currentCards = null;

    room.passCount = 0;

    room.passedPlayers = [];

    const last = room.lastPlayer;

    if (last && room.inGamePlayers.includes(last)) {
        room.turn = last;
    } else {
        room.turn = room.inGamePlayers[0];
    }

    io.to(room.id).emit("round_reset", {
        turn: room.turn,
    });

    emitRoomState(io, room);
}

module.exports = resetRound;
