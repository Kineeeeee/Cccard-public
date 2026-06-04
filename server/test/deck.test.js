const { createDeck, shuffle } = require("../deck");

describe("deck", () => {
    test("createDeck should return 52 cards", () => {
        const deck = createDeck();
        expect(deck.length).toBe(52);

        // Ensure some specific cards exist
        expect(deck).toContain("3♠");
        expect(deck).toContain("2♥");
    });

    test("shuffle should randomize the deck", () => {
        const deck1 = createDeck();
        const deck2 = createDeck();

        shuffle(deck1);

        // Very low probability that they are in the exact same order
        expect(deck1).not.toEqual(deck2);

        // Should still have 52 cards
        expect(deck1.length).toBe(52);

        // All elements in deck2 must exist in deck1
        deck2.forEach((card) => {
            expect(deck1).toContain(card);
        });
    });
});
