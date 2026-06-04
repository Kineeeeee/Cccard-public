const { calculatePenalty } = require("../engine/scoring/calculatePenalty");
const { parseCard } = require("../core/card/card");

describe("calculatePenalty", () => {
    test("Should calculate penalty for normal cards and twos", () => {
        const scoreRules = {
            normalPen: 10,
            twosPen: 50,
        };

        const cards = [
            parseCard("3♠"),
            parseCard("10♥"),
            parseCard("2♦"), // Two!
            parseCard("2♣"), // Two!
        ];

        // 4 cards * 10 (normalPen) = 40
        // 2 twos * 50 (twosPen) = 100
        // Total = 140
        const penalty = calculatePenalty(cards, scoreRules);
        expect(penalty).toBe(140);
    });

    test("Should calculate penalty for quads and consecutive pairs", () => {
        const scoreRules = {
            normalPen: 1,
            twosPen: 0,
            quadPen: 20,
            consPairPen: 30,
        };
        const cards = [
            parseCard("3♠"),
            parseCard("3♥"),
            parseCard("3♦"),
            parseCard("3♣"), // Quad!
            parseCard("5♠"),
            parseCard("5♣"), // Pair 1
            parseCard("6♠"),
            parseCard("6♣"), // Pair 2
            parseCard("7♠"),
            parseCard("7♣"), // Pair 3 (Forms 3 consecutive pairs)
        ];

        // 10 cards * 1 = 10
        // 1 quad * 20 = 20
        // 1 consPair * 30 = 30
        // Total = 60
        const penalty = calculatePenalty(cards, scoreRules);
        expect(penalty).toBe(60);
    });

    test("Should calculate penalty for empty hand", () => {
        const scoreRules = { normalPen: 10, twosPen: 50 };
        const penalty = calculatePenalty([], scoreRules);
        expect(penalty).toBe(0);
    });
});
