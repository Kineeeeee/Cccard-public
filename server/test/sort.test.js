const { sortCards } = require("../core/sort");
const { parseCard } = require("../core/card/card");

function getHand(rawStrings) {
    return rawStrings.map(parseCard);
}

describe("sortCards", () => {
    test("Should sort cards by rank ascending, then suit ascending", () => {
        const cards = getHand(["2♠", "3♣", "3♠", "A♥", "10♦"]);

        const sorted = sortCards(cards);

        expect(sorted[0].raw).toBe("3♠");
        expect(sorted[1].raw).toBe("3♣");
        expect(sorted[2].raw).toBe("10♦");
        expect(sorted[3].raw).toBe("A♥");
        expect(sorted[4].raw).toBe("2♠");
    });
});
