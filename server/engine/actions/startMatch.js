const { emitRoomState } = require("../../emitters/emitRoomState");

const startGame = require("./startGame");

const { getRoom } = require("../../managers/roomManager");

function startMatch(io, roomId, userId) {
    const room = getRoom(roomId);

    if (!room) return;

    // Only the room host can manually start or resume a match
    if (room.host !== userId) {
        return;
    }

    // Minimum 2 players required
    if (Object.keys(room.players).length < 2) {
        return;
    }

    if (room.paused) {
        room.paused = false;

        // Give 5 seconds to timer after resume game
        if (room.turnTimeLeft > 0 && room.turnTimeLeft <= 10) {
            room.turnTimeLeft += 5;
        }

        io.to(roomId).emit("game_resumed");

        emitRoomState(io, room);

        if (room.gameOver) {
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
            }, 5000);
        }

        return;
    }

    if (room.gameStarted) {
        return;
    }

    room.gameStarted = true;

    startGame(io, roomId);
}

module.exports = startMatch;
