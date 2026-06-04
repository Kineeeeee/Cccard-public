const { canBeat } = require("../engine/rules/specialRules");

describe("Special Rules ", () => {
    test("Quad beats single 2", () => {
        const move = { type: "QUAD" };
        const last = { type: "SINGLE", rank: 14 }; // 2 (Heo)
        expect(canBeat(move, last)).toBe(true);
    });

    test("Quad beats pair 2", () => {
        const move = { type: "QUAD" };
        const last = { type: "PAIR", rank: 14 };
        expect(canBeat(move, last)).toBe(true);
    });

    test("Quad cannot beats single 3", () => {
        const move = { type: "QUAD" };
        const last = { type: "SINGLE", rank: 2 }; // 3
        expect(canBeat(move, last)).toBe(false);
    });

    test("3 cons pair beats single 2", () => {
        const move = { type: "CONS_PAIR", size: 6 };
        const last = { type: "SINGLE", rank: 14 };
        const settings = { rules: { allowConsecutivePair: true } };
        expect(canBeat(move, last, settings)).toBe(true);
    });

    test("3 cons pair cannot beat pair 2", () => {
        const move = { type: "CONS_PAIR", size: 6 };
        const last = { type: "PAIR", rank: 14 };
        const settings = { rules: { allowConsecutivePair: true } };
        expect(canBeat(move, last, settings)).toBe(false);
    });

    test("Quad beats 3 cons pair", () => {
        const move = { type: "QUAD" };
        const last = { type: "CONS_PAIR", size: 6 };
        expect(canBeat(move, last)).toBe(true);
    });

    test("4 cons pair beats quad", () => {
        const move = { type: "CONS_PAIR", size: 8 };
        const last = { type: "QUAD" };
        const settings = { rules: { allowConsecutivePair: true } };
        expect(canBeat(move, last, settings)).toBe(true);
    });
});
