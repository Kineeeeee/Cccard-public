const {
    isValidMove,

    isWinning,

    mustPlayHighest,
} = require("../rules/gameRules");

const { sortCards } = require("../../core/sort");

const { normalizeCards } = require("../utils/normalize");

const getNextPlayer = require("../utils/getNextPlayer");

const { emitRoomState } = require("../../emitters/emitRoomState");

const { createContext } = require("../context");

const startTurnTimer = require("../../timers/startTurnTimer");

const passTurn = require("./passTurn");

const handleWin = require("./handleWin");

const startGame = require("./startGame");

const handleDeclareLoss = require("./handleDeclareLoss");

const { getRoom } = require("../../managers/roomManager");
const { getCombo } = require("../detect/getCombo");
const processChop = require("../scoring/processChop");

function playCards(io, roomId, userId, cards) {
    const room = getRoom(roomId);

    if (!room) return;

    const ctx = createContext(room, userId);

    if (ctx.turn !== ctx.userId) return;
    if (room.gameOver) return;
    if (room.paused) return;
    if (room.preparing) return;
    if (ctx.passedPlayers.includes(ctx.userId)) return;

    cards = sortCards(normalizeCards(cards));

    const hand = ctx.hands[ctx.userId];

    if (!hand) return;

    const hasCard = (hand, card) =>
        hand.some(
            (c) =>
                c.rankValue === card.rankValue &&
                c.suitValue === card.suitValue,
        );

    for (const card of cards) {
        if (!hasCard(hand, card)) {
            return;
        }
    }

    if (!isValidMove(cards, ctx)) {
        return;
    }

    // The premature intercept check was removed from here.
    // It will be handled after the cards are placed on the table so the UI can render them.

    const playedCombo = getCombo(cards);
    if (playedCombo && playedCombo.sortedCards) {
        cards = playedCombo.sortedCards;
    }

    // process chop if possible
    processChop(room, userId, playedCombo);

    const nextPlayerId = getNextPlayer(ctx);

    // must play highest if next player has only 1 card
    if (
        nextPlayerId &&
        ctx.hands[nextPlayerId] &&
        ctx.hands[nextPlayerId].length === 1
    ) {
        if (!mustPlayHighest(cards, ctx)) {
            return;
        }
    }

    room.hands[userId] = hand.filter(
        (handCard) =>
            !cards.some(
                (card) =>
                    card.rankValue === handCard.rankValue &&
                    card.suitValue === handCard.suitValue,
            ),
    );

    const socketId = ctx.players[userId].socketId;

    io.to(socketId).emit(
        "your_hand",
        room.hands[userId].map((card) => card.raw),
    );

    room.currentCards = [...cards];

    room.lastPlayer = userId;

    // check if player win
    if (isWinning(room.hands[ctx.userId])) {
        handleWin(io, roomId, startGame, userId);

        return;
    }

    if (room.declareWinner && room.declareWinner !== userId) {
        // Intercepted! The interceptor successfully played a card.
        io.to(roomId).emit("card_played", {
            player: ctx.players[ctx.userId].name,
            cards: cards.map((card) => card.raw),
            turn: room.turn, 
        });
        
        emitRoomState(io, room);
        
        handleDeclareLoss(io, roomId, startGame, room.declareWinner, userId);
        return;
    }

    room.turn = nextPlayerId;

    startTurnTimer(io, room, () => {
        const timedOutPlayer = room.turn;

        passTurn(io, room, roomId, timedOutPlayer, true);
    });

    io.to(roomId).emit("card_played", {
        player: ctx.players[ctx.userId].name,

        cards: cards.map((card) => card.raw),

        turn: room.turn,
    });

    emitRoomState(io, room);
}

module.exports = playCards;
