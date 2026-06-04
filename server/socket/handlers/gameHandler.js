const playCards = require("../../../server/engine/actions/playCards");

const passTurn = require("../../../server/engine/actions/passTurn");

const validateSelectedCards = require("../../../server/engine/actions/validateSelectedCards");

const { getRoom } = require("../../managers/roomManager");

const { createContext } = require("../../engine/context");

const { normalizeCards } = require("../../engine/utils/normalize");

const { sortCards } = require("../../core/sort");

const {
    isValidMove,
    mustPlayHighest,
} = require("../../engine/rules/gameRules");

const getNextPlayer = require("../../engine/utils/getNextPlayer");

module.exports = (io, socket) => {
    socket.on("play_card", ({ roomId, userId, cards }) => {
        playCards(io, roomId, userId, cards);
    });

    socket.on("pass_turn", ({ roomId, userId }) => {
        const room = getRoom(roomId);

        if (!room) return;

        passTurn(io, room, roomId, userId);
    });

    socket.on("validate_selected_cards", ({ roomId, userId, cards }) => {
        validateSelectedCards(socket, roomId, userId, cards);
    });

    socket.on("sort_hand", ({ roomId, userId }) => {
        const room = getRoom(roomId);
        if (!room) return;

        if (room.hands[userId]) {
            room.hands[userId] = sortCards(room.hands[userId]);
            socket.emit(
                "your_hand",
                room.hands[userId].map((card) => card.raw),
            );
        }
    });
};
