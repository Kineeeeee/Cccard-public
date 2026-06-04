// check if player leaves only twos after playing cards
function leavesOnlyTwos(hand, cards) {
    const remainingHand = hand.filter(
        (handCard) =>
            !cards.some(
                (c) =>
                    c.rankValue === handCard.rankValue &&
                    c.suitValue === handCard.suitValue,
            ),
    );
    return (
        remainingHand.length > 0 &&
        remainingHand.every((c) => c.rankValue === 14)
    );
}

module.exports = leavesOnlyTwos;
