const stopTurnTimer = require("../../timers/stopTurnTimer");
const { emitRoomState } = require("../../emitters/emitRoomState");
const { getRoom } = require("../../managers/roomManager");
const removePlayer = require("./removePlayer");

// action when player declare loss
function handleDeclareLoss(io, roomId, startGame, declarerId, interceptorId) {
    const room = getRoom(roomId);
    if (!room) return;

    room.gameOver = true;
    stopTurnTimer(room);

    const changes = [];
    const penaltyPerPlayer =
        room.settings.rules.cardsPerPlayer * room.settings.scoring.normalPen;
    let totalPenalty = 0;

    room.inGamePlayers.forEach((playerId) => {
        if (playerId !== declarerId) {
            room.players[playerId].score += penaltyPerPlayer;
            totalPenalty += penaltyPerPlayer;

            changes.push({
                userId: playerId,
                delta: penaltyPerPlayer,
            });
        }
    });

    // Declarer loses the sum of all penalties
    room.players[declarerId].score -= totalPenalty;
    changes.push({
        userId: declarerId,
        delta: -totalPenalty,
    });

    // Interceptor gets the win count (since they technically won the round)
    if (room.players[interceptorId]) {
        room.players[interceptorId].wins++;
    }

    io.to(roomId).emit("score_update", { changes });

    setTimeout(() => {
        emitRoomState(io, room);
    }, 300);

    const interceptorName = room.players[interceptorId]?.name || interceptorId;
    io.to(roomId).emit("game_over", {
        winner: interceptorName,
        reason: `Declare fail! (Prevented by ${interceptorName})`,
    });

    setTimeout(() => {
        const currentRoom = getRoom(roomId);
        if (currentRoom) {
            currentRoom.currentCards = null;
            currentRoom.gameStarted = false;

            // Remove any ghost players completely
            Object.keys(currentRoom.players).forEach((userId) => {
                if (currentRoom.players[userId].quitting) {
                    removePlayer(io, roomId, userId);
                }
            });

            emitRoomState(io, currentRoom);
        }
    }, 5000);

    if (room.restartTimeout) {
        clearTimeout(room.restartTimeout);
        room.restartTimeout = null;
    }

    room.restartTimeout = setTimeout(() => {
        const currentRoom = getRoom(roomId);
        if (!currentRoom || currentRoom.paused) return;

        startGame(io, roomId);
        currentRoom.restartTimeout = null;
    }, 10000);
}

module.exports = handleDeclareLoss;
