const {
    isChopTarget,
    getChopPenalty,
} = require("../engine/scoring/calculateChop");

describe("calculateChop", () => {
    test("isChopTarget should identify valid chop targets", () => {
        expect(isChopTarget({ type: "SINGLE", rank: 14 })).toBe(true);
        expect(isChopTarget({ type: "PAIR", rank: 14 })).toBe(true);
        expect(isChopTarget({ type: "CONS_PAIR", size: 6 })).toBe(true);
        expect(isChopTarget({ type: "QUAD" })).toBe(true);
        expect(isChopTarget({ type: "SINGLE", rank: 13 })).toBe(false);
    });

    test("getChopPenalty should calculate correct penalty based on chopPen", () => {
        const scoring = { chopPen: 10 };

        expect(getChopPenalty({ type: "SINGLE", rank: 14 }, scoring)).toBe(10);
        expect(getChopPenalty({ type: "PAIR", rank: 14 }, scoring)).toBe(20);

        // 3 pairs
        expect(getChopPenalty({ type: "CONS_PAIR", size: 6 }, scoring)).toBe(
            10,
        );
        // 4 pairs
        expect(getChopPenalty({ type: "CONS_PAIR", size: 8 }, scoring)).toBe(
            20,
        );

        expect(getChopPenalty({ type: "QUAD" }, scoring)).toBe(20);

        expect(getChopPenalty({ type: "SINGLE", rank: 13 }, scoring)).toBe(0);
    });
});
