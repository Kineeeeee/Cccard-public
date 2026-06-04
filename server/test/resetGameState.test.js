const resetGameState = require("../engine/setup/resetGameState");

describe("resetGameState", () => {
    test("Should reset necessary fields in room object", () => {
        const room = {
            hands: { p1: [1, 2, 3] },
            currentCards: { type: "SINGLE" },
            passCount: 3,
            passedPlayers: ["p2", "p3"],
            gameOver: true,
            otherField: "should_not_change", // should remain
        };

        resetGameState(room);

        expect(room.hands).toEqual({});
        expect(room.currentCards).toBeNull();
        expect(room.passCount).toBe(0);
        expect(room.passedPlayers).toEqual([]);
        expect(room.gameOver).toBe(false);
        expect(room.otherField).toBe("should_not_change");
    });
});
