const stopTurnTimer = require("../../timers/stopTurnTimer");

const { emitRoomState } = require("../../emitters/emitRoomState");

const { applyGameScores } = require("../scoring/applyGameScores");

const { getRoom } = require("../../managers/roomManager");
const removePlayer = require("./removePlayer");

function handleWin(io, roomId, startGame, winnerId, winnerReason = null) {
    const room = getRoom(roomId);

    if (!room) return;

    room.gameOver = true;

    stopTurnTimer(room);

    // Calculate penalties for remaining players and update global scores
    const changes = applyGameScores(room, winnerId);

    if (room.players[winnerId]) {
        room.players[winnerId].wins++;
    }

    io.to(roomId).emit("score_update", {
        changes,
    });

    setTimeout(() => {
        emitRoomState(io, room);
    }, 300);

    io.to(roomId).emit("game_over", {
        winner: room.players[winnerId].name,

        reason: winnerReason,
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

        if (!currentRoom) {
            return;
        }

        if (currentRoom.paused) {
            return;
        }

        startGame(io, roomId);

        currentRoom.restartTimeout = null;
    }, 10000);
}

module.exports = handleWin;
