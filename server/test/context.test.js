const { createContext } = require("../engine/context");

describe("createContext", () => {
    test("Should extract correct fields from room into context", () => {
        const room = {
            id: "room123",
            settings: { rules: { someRule: true } },
            players: ["p1", "p2"],
            hands: { p1: [], p2: [] },
            currentCards: null,
            turn: "p1",
            lastPlayer: "p2",
            inGamePlayers: ["p1", "p2"],
            passedPlayers: [],
        };

        const ctx = createContext(room, "p1");

        expect(ctx.room).toBe(room);
        expect(ctx.roomId).toBe("room123");
        expect(ctx.settings.rules.someRule).toBe(true);
        expect(ctx.players).toEqual(["p1", "p2"]);
        expect(ctx.hands).toEqual({ p1: [], p2: [] });
        expect(ctx.currentCards).toBeNull();
        expect(ctx.turn).toBe("p1");
        expect(ctx.lastPlayer).toBe("p2");
        expect(ctx.inGamePlayers).toEqual(["p1", "p2"]);
        expect(ctx.passedPlayers).toEqual([]);
        expect(ctx.userId).toBe("p1");
    });

    test("Should fallback to empty settings if room.settings is undefined", () => {
        const room = {
            id: "room456",
        };

        const ctx = createContext(room);

        expect(ctx.settings).toEqual({});
        expect(ctx.userId).toBeNull(); // Default userId
    });
});
