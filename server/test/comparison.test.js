const { compareCombos } = require("../engine/comparison/compareCombos");

describe("Comparison Logic", () => {
    const ctxSuitEnabled = { settings: { rules: { compareSuit: true } } };
    const ctxSuitDisabled = { settings: { rules: { compareSuit: false } } };

    test("Same rank, different suit", () => {
        const comboA = { type: "SINGLE", rank: 2, suit: 3 }; // 3♥
        const comboB = { type: "SINGLE", rank: 2, suit: 0 }; // 3♠
        expect(compareCombos(comboA, comboB, ctxSuitEnabled)).toBe(true); // A > B
        expect(compareCombos(comboB, comboA, ctxSuitEnabled)).toBe(false); // B < A
    });

    test("Same rank, no suit comparision", () => {
        const comboA = { type: "SINGLE", rank: 2, suit: 3 }; // 3♥
        const comboB = { type: "SINGLE", rank: 2, suit: 0 }; // 3♠
        expect(compareCombos(comboA, comboB, ctxSuitDisabled)).toBe(false);
    });

    test("Different rank", () => {
        const comboA = { type: "SINGLE", rank: 3, suit: 0 }; // 4♠
        const comboB = { type: "SINGLE", rank: 2, suit: 3 }; // 3♥
        expect(compareCombos(comboA, comboB, ctxSuitEnabled)).toBe(true);
    });

    test("Different type", () => {
        const comboA = { type: "DOUBLE", rank: 3, suit: 0 };
        const comboB = { type: "SINGLE", rank: 2, suit: 3 };
        expect(compareCombos(comboA, comboB, ctxSuitEnabled)).toBe(false);
    });
});
