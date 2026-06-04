module.exports = {
    rules: {
        cardsPerPlayer: 13,
        allowFinishWithTwos: false,
        allowA23Straight: false,
        allowFinishWithQuad: false,
        allowConsecutivePair: false,
        mustPlayHighestWhenOpponentOneCard: true,
        firstTurnMode: "random",
        compareSuit: true,
    },

    scoring: {
        normalPen: 1,
        quadPen: 0,
        twosPen: 0,
        consPairPen: 0,
        chopPen: 5,
    },

    timers: {
        turnTime: 15,
        prepTime: 10,
    },
};
