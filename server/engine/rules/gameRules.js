const { getCombo } = require("../detect/getCombo");

const { compareCombos } = require("../comparison/compareCombos");

const { sortCards } = require("../../core/sort");

const { canBeat } = require("./specialRules");

const getNextPlayer = require("../utils/getNextPlayer");

const canFinishWithCombo = require("./canFinishWithCombo");

const getHighestCard = require("../../core/card/getHighestCard");

const isEmptyHand = require("./isEmptyHand");

const leavesOnlyTwos = require("./leavesOnlyTwos");

function isValidMove(cards, ctx) {
    if (!cards || cards.length === 0) return false;

    cards = sortCards(cards);
    const hand = ctx.hands[ctx.userId];
    if (!hand) return false;

    // A valid move must be a recognized combination
    const move = getCombo(cards);
    if (!move || move.type === "INVALID") return false;

    const isFinalMove = hand.length === cards.length;

    // check special play cards rule
    if (
        move.type === "CONS_PAIR" &&
        (!ctx.settings || !ctx.settings.rules.allowConsecutivePair)
    ) {
        return false;
    }

    if (
        move.type === "STRAIGHT" &&
        move.containsTwo &&
        (!ctx.settings || !ctx.settings.rules.allowA23Straight)
    ) {
        return false;
    }

    if (!isFinalMove && !ctx.settings.rules.allowFinishWithTwos) {
        if (leavesOnlyTwos(hand, cards)) {
            return false;
        }
    }

    if (isFinalMove && !canFinishWithCombo(cards, ctx.settings)) {
        return false;
    }

    const currentCards = ctx.currentCards;

    // first turn
    if (!currentCards || currentCards.length === 0) return true;

    const last = getCombo(currentCards);
    if (!last) return true;

    if (canBeat(move, last, ctx.settings)) {
        return true;
    }

    return compareCombos(move, last, ctx);
}

function mustPlayHighest(cards, ctx) {
    if (
        ctx.settings &&
        !ctx.settings.rules.mustPlayHighestWhenOpponentOneCard
    ) {
        return true;
    }

    const nextPlayerId = getNextPlayer(ctx);

    if (!nextPlayerId) {
        return true;
    }

    const nextHand = ctx.hands[nextPlayerId];

    const opponentAboutToWin = nextHand && nextHand.length === 1;

    // next player only have 1 card left
    if (!opponentAboutToWin) {
        return true;
    }

    const highestCard = getHighestCard(ctx.hands[ctx.userId]);

    const highestMove = getCombo([highestCard]);

    const move = getCombo(cards);

    if (move.type !== "SINGLE") {
        return true;
    }

    // play card that is at least equal to the highest card
    if (ctx.settings.rules.compareSuit) {
        return compareCombos(move, highestMove, ctx);
    }

    return move.rank === highestMove.rank;
}

module.exports = {
    isValidMove,

    isWinning: isEmptyHand,

    mustPlayHighest,
};
