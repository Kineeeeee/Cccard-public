const { getRoom } = require("../../managers/roomManager");

const { createContext } = require("../context");

const { normalizeCards } = require("../utils/normalize");

const { sortCards } = require("../../core/sort");

const { isValidMove, mustPlayHighest } = require("../rules/gameRules");

const getNextPlayer = require("../utils/getNextPlayer");

function validateSelectedCards(socket, roomId, userId, cards) {
    const room = getRoom(roomId);
    if (!room) {
        socket.emit("validate_selected_cards_result", { valid: false });
        return;
    }

    const ctx = createContext(room, userId);

    if (
        ctx.turn !== ctx.userId ||
        room.gameOver ||
        room.paused ||
        room.preparing
    ) {
        socket.emit("validate_selected_cards_result", { valid: false });
        return;
    }

    if (ctx.passedPlayers.includes(ctx.userId)) {
        socket.emit("validate_selected_cards_result", { valid: false });
        return;
    }

    if (!cards || cards.length === 0) {
        socket.emit("validate_selected_cards_result", { valid: false });
        return;
    }

    try {
        const sortedNormalized = sortCards(normalizeCards(cards));
        const hand = ctx.hands[ctx.userId];
        if (!hand) {
            socket.emit("validate_selected_cards_result", { valid: false });
            return;
        }

        const hasCard = (hand, card) =>
            hand.some(
                (c) =>
                    c.rankValue === card.rankValue &&
                    c.suitValue === card.suitValue,
            );

        let hasAll = true;
        for (const card of sortedNormalized) {
            if (!hasCard(hand, card)) {
                hasAll = false;
                break;
            }
        }

        if (!hasAll) {
            socket.emit("validate_selected_cards_result", { valid: false });
            return;
        }

        if (!isValidMove(sortedNormalized, ctx)) {
            socket.emit("validate_selected_cards_result", { valid: false });
            return;
        }

        const nextPlayerId = getNextPlayer(ctx);
        if (
            nextPlayerId &&
            ctx.hands[nextPlayerId] &&
            ctx.hands[nextPlayerId].length === 1
        ) {
            if (!mustPlayHighest(sortedNormalized, ctx)) {
                socket.emit("validate_selected_cards_result", { valid: false });
                return;
            }
        }

        socket.emit("validate_selected_cards_result", { valid: true });
    } catch (e) {
        socket.emit("validate_selected_cards_result", { valid: false });
    }
}

module.exports = validateSelectedCards;
