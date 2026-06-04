const { getCombo } = require("../engine/detect/getCombo");
const { parseCard } = require("../core/card/card");

function getCards(rawStrings) {
    return rawStrings.map(parseCard);
}

describe("Detection Logic", () => {
    test("Detect Single", () => {
        const combo = getCombo(getCards(["3♠"]));
        expect(combo.type).toBe("SINGLE");
        expect(combo.rank).toBe(2); // 3 -> index 0 + 2 = 2
        expect(combo.suit).toBe(0); // ♠ -> index 0
    });

    test("Detect Pair", () => {
        const combo = getCombo(getCards(["4♠", "4♥"]));
        expect(combo.type).toBe("DOUBLE");
        expect(combo.rank).toBe(3); // 4 -> index 1 + 2 = 3
    });

    test("Detect Triple", () => {
        const combo = getCombo(getCards(["5♠", "5♥", "5♦"]));
        expect(combo.type).toBe("TRIPLE");
        expect(combo.rank).toBe(4);
    });

    test("Detect Quad", () => {
        const combo = getCombo(getCards(["6♠", "6♥", "6♦", "6♣"]));
        expect(combo.type).toBe("QUAD");
        expect(combo.rank).toBe(5);
    });

    test("Detect Straight", () => {
        // Straight 3, 4, 5
        const combo = getCombo(getCards(["3♠", "4♥", "5♦"]));
        expect(combo.type).toBe("STRAIGHT");
        expect(combo.size).toBe(3);
        expect(combo.rank).toBe(4); // Largest card rank
    });

    test("Detect Straight Edge Cases", () => {
        // J Q K A
        const comboA = getCombo(getCards(["J♠", "Q♥", "K♦", "A♣"]));
        // A-2-3-4
        const comboA234 = getCombo(getCards(["A♠", "2♥", "3♦", "4♣"]));
        expect(comboA234.type).toBe("STRAIGHT");
        expect(comboA234.rank).toBe(3); // 4 is the highest card of A-low, its rankValue is 3.

        // Q K A 2 (No straight with 2 at the end)
        const comboInvalid = getCombo(getCards(["Q♠", "K♥", "A♦", "2♣"]));
        expect(comboInvalid.type).toBe("INVALID");
    });
});
