const {
    hasDragonStraight,
    hasFullPairs,
    hasFourTwos,
    hasNoFaces,
    hasSameColour,
} = require("../engine/win/winPatterns");
const { parseCard } = require("../core/card/card");

function getHand(rawStrings) {
    return rawStrings.map(parseCard);
}

describe("Win Patterns", () => {
    test("hasDragonStraight", () => {
        const hand = getHand([
            "3♠",
            "4♥",
            "5♦",
            "6♣",
            "7♠",
            "8♥",
            "9♦",
            "10♣",
            "J♠",
            "Q♥",
            "K♦",
            "A♣",
            "2♠",
        ]); // 3 -> 2 is 13 cards straight
        expect(hasDragonStraight(hand)).toBe(true);

        const notDragon = getHand([
            "3♠",
            "4♥",
            "5♦",
            "6♣",
            "7♠",
            "8♥",
            "9♦",
            "10♣",
            "J♠",
            "Q♥",
            "K♦",
            "3♣",
            "3♦",
        ]);
        expect(hasDragonStraight(notDragon)).toBe(false);
    });

    test("hasFullPairs", () => {
        const hand = getHand([
            "3♠",
            "3♥",
            "5♦",
            "5♣",
            "7♠",
            "7♥",
            "9♦",
            "9♣",
            "J♠",
            "J♥",
            "K♦",
            "K♣",
            "2♠",
        ]);
        expect(hasFullPairs(hand)).toBe(true);

        const notFullPairs = getHand([
            "3♠",
            "4♥",
            "5♦",
            "5♣",
            "7♠",
            "7♥",
            "9♦",
            "9♣",
            "J♠",
            "J♥",
            "K♦",
            "K♣",
            "2♠",
        ]); // only 5 pairs
        expect(hasFullPairs(notFullPairs)).toBe(false);
    });

    test("hasFourTwos", () => {
        const hand = getHand([
            "2♠",
            "2♣",
            "2♦",
            "2♥",
            "3♠",
            "4♥",
            "5♦",
            "6♣",
            "7♠",
            "8♥",
            "9♦",
            "10♣",
            "J♠",
        ]);
        expect(hasFourTwos(hand)).toBe(true);

        const notFourTwos = getHand([
            "2♠",
            "2♣",
            "2♦",
            "3♥",
            "3♠",
            "4♥",
            "5♦",
            "6♣",
            "7♠",
            "8♥",
            "9♦",
            "10♣",
            "J♠",
        ]);
        expect(hasFourTwos(notFourTwos)).toBe(false);
    });

    test("hasNoFaces", () => {
        const hand = getHand([
            "3♠",
            "3♣",
            "4♦",
            "4♥",
            "5♠",
            "6♥",
            "7♦",
            "8♣",
            "8♠",
            "9♥",
            "9♦",
            "10♣",
            "10♠",
        ]);
        expect(hasNoFaces(hand)).toBe(true);

        const hasFace = getHand([
            "3♠",
            "3♣",
            "4♦",
            "4♥",
            "5♠",
            "6♥",
            "7♦",
            "8♣",
            "8♠",
            "9♥",
            "9♦",
            "10♣",
            "J♠",
        ]);
        expect(hasNoFaces(hasFace)).toBe(false);
    });

    test("hasSameColour", () => {
        const allBlack = getHand([
            "3♠",
            "4♣",
            "5♠",
            "6♣",
            "7♠",
            "8♣",
            "9♠",
            "10♣",
            "J♠",
            "Q♣",
            "K♠",
            "A♣",
            "2♠",
        ]);
        expect(hasSameColour(allBlack)).toBe(true);

        const allRed = getHand([
            "3♦",
            "4♥",
            "5♦",
            "6♥",
            "7♦",
            "8♥",
            "9♦",
            "10♥",
            "J♦",
            "Q♥",
            "K♦",
            "A♥",
            "2♦",
        ]);
        expect(hasSameColour(allRed)).toBe(true);

        const mixed = getHand([
            "3♠",
            "4♥",
            "5♦",
            "6♣",
            "7♠",
            "8♥",
            "9♦",
            "10♣",
            "J♠",
            "Q♥",
            "K♦",
            "A♣",
            "2♠",
        ]);
        expect(hasSameColour(mixed)).toBe(false);
    });
});
