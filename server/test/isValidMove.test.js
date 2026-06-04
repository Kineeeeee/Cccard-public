const { isValidMove } = require("../engine/rules/gameRules");
const { parseCard } = require("../core/card/card");

describe("isValidMove", () => {
    test("Should not allow finishing with a 2 if allowFinishWithTwos is false", () => {
        const ctx = {
            userId: "u1",
            hands: { u1: [parseCard("2♠")] },
            currentCards: null,
            settings: { rules: { allowFinishWithTwos: false } },
        };
        const cards = [parseCard("2♠")];

        expect(isValidMove(cards, ctx)).toBe(false);
    });

    test("Should allow finishing with a 2 if allowFinishWithTwos is true", () => {
        const ctx = {
            userId: "u1",
            hands: { u1: [parseCard("2♠")] },
            currentCards: null,
            settings: { rules: { allowFinishWithTwos: true } },
        };
        const cards = [parseCard("2♠")];

        expect(isValidMove(cards, ctx)).toBe(true);
    });

    test("Should not allow a move if it leaves ONLY 2s in hand (and allowFinishWithTwos is false)", () => {
        const ctx = {
            userId: "u1",
            hands: { u1: [parseCard("3♠"), parseCard("2♥"), parseCard("2♦")] },
            currentCards: null,
            settings: { rules: { allowFinishWithTwos: false } },
        };
        // Playing the 3♠ leaves 2♥ and 2♦
        const cards = [parseCard("3♠")];

        expect(isValidMove(cards, ctx)).toBe(false);
    });

    test("Should allow a move leaving ONLY 2s in hand if allowFinishWithTwos is true", () => {
        const ctx = {
            userId: "u1",
            hands: { u1: [parseCard("3♠"), parseCard("2♥"), parseCard("2♦")] },
            currentCards: null,
            settings: { rules: { allowFinishWithTwos: true } },
        };
        // Playing the 3♠ leaves 2♥ and 2♦
        const cards = [parseCard("3♠")];

        expect(isValidMove(cards, ctx)).toBe(true);
    });

    test("Should allow a move if it leaves a 2 AND another card (allowFinishWithTwos is false)", () => {
        const ctx = {
            userId: "u1",
            hands: { u1: [parseCard("3♠"), parseCard("4♠"), parseCard("2♥")] },
            currentCards: null,
            settings: { rules: { allowFinishWithTwos: false } },
        };
        // Playing the 3♠ leaves 4♠ and 2♥ (Not ONLY 2s)
        const cards = [parseCard("3♠")];

        expect(isValidMove(cards, ctx)).toBe(true);
    });
});
