const { getRoom } = require("../../managers/roomManager");

function updateSettings(io, roomId, userId, settings) {
    const room = getRoom(roomId);

    if (!room) return;

    // only host can update settings
    if (room.host !== userId) {
        return;
    }

    if (room.gameStarted) {
        return;
    }

    room.settings = {
        ...room.settings,
        ...settings,
        rules: {
            ...room.settings.rules,
            ...(settings.rules || {}),
        },
        scoring: {
            ...room.settings.scoring,
            ...(settings.scoring || {}),
        },
        timers: {
            ...room.settings.timers,
            ...(settings.timers || {}),
        },
    };

    io.to(roomId).emit("settings_updated", room.settings);
}

module.exports = updateSettings;
