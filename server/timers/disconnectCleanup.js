const removePlayer = require("../engine/actions/removePlayer");
const quitGame = require("../engine/actions/quitGame");
const { getRooms } = require("../managers/roomManager");

const {
    DISCONNECT_TIMEOUT,

    DISCONNECT_CHECK_INTERVAL,
} = require("../config/constants");

function startDisconnectCleanup(io) {
    setInterval(() => {
        const rooms = getRooms();

        for (const roomId of Object.keys(rooms)) {
            const room = rooms[roomId];

            for (const player of Object.values(room.players)) {
                // Only clean up players who have been disconnected for longer than the timeout threshold
                if (
                    !player.connected &&
                    player.disconnectedAt &&
                    Date.now() - player.disconnectedAt >= DISCONNECT_TIMEOUT
                ) {
                    // Change ingame player to ghost player and remove when game ends
                    if (room.gameStarted && room.inGamePlayers && room.inGamePlayers.includes(player.userId)) {
                        if (!player.quitting) {
                            quitGame(io, roomId, player.userId);
                        }
                    } else {
                        removePlayer(io, roomId, player.userId);
                    }
                }
            }
        }
    }, DISCONNECT_CHECK_INTERVAL);
}

module.exports = {
    startDisconnectCleanup,
};
