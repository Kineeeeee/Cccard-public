const checkInstantWin = require("../engine/setup/checkInstantWin");
const { parseCard } = require("../core/card/card");

function getHand(rawStrings) {
    return rawStrings.map(parseCard);
}

describe("checkInstantWin", () => {
    test("Should return the first winning player", () => {
        const room = {
            inGamePlayers: ["p1", "p2", "p3"],
            hands: {
                p1: getHand([
                    "3♠",
                    "4♣",
                    "5♦",
                    "6♥",
                    "7♠",
                    "8♣",
                    "9♦",
                    "10♥",
                    "J♠",
                    "Q♣",
                    "K♦",
                    "A♥",
                    "3♦",
                ]), // Normal hand
                p2: getHand([
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
                ]), // Dragon straight
                p3: getHand([
                    "3♠",
                    "3♣",
                    "4♦",
                    "4♥",
                    "5♠",
                    "5♥",
                    "6♦",
                    "6♣",
                    "7♠",
                    "7♥",
                    "8♦",
                    "8♣",
                    "9♠",
                ]), // 6 pairs
            },
        };

        const result = checkInstantWin(room);

        // p2 is checked before p3 in the inGamePlayers array
        expect(result).not.toBeNull();
        expect(result.player).toBe("p2");
        expect(result.reason).toBe("DRAGON");
    });

    test("Should return null if no one wins instantly", () => {
        const room = {
            inGamePlayers: ["p1", "p2"],
            hands: {
                p1: getHand([
                    "3♠",
                    "3♣",
                    "7♦",
                    "9♥",
                    "J♠",
                    "K♣",
                    "4♦",
                    "4♥",
                    "6♠",
                    "8♣",
                    "10♦",
                    "Q♥",
                    "A♠",
                ]),
                p2: getHand([
                    "3♣",
                    "5♦",
                    "7♥",
                    "9♠",
                    "J♣",
                    "K♦",
                    "2♥",
                    "2♠",
                    "6♣",
                    "8♦",
                    "10♥",
                    "Q♠",
                    "A♣",
                ]),
            },
        };

        const result = checkInstantWin(room);
        expect(result).toBeNull();
    });
});
