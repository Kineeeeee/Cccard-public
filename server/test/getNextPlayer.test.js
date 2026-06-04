const getNextPlayer = require("../engine/utils/getNextPlayer");

describe("getNextPlayer", () => {
    test("Should return null if inGamePlayers is empty", () => {
        const ctx = {
            inGamePlayers: [],
            userId: "user1",
            passedPlayers: [],
        };
        expect(getNextPlayer(ctx)).toBeNull();
    });

    test("Should return first player if userId is not in inGamePlayers", () => {
        const ctx = {
            inGamePlayers: ["user1", "user2", "user3"],
            userId: "observer",
            passedPlayers: [],
        };
        expect(getNextPlayer(ctx)).toBe("user1");
    });

    test("Should return the next player in circle", () => {
        const ctx = {
            inGamePlayers: ["user1", "user2", "user3"],
            userId: "user1",
            passedPlayers: [],
        };
        expect(getNextPlayer(ctx)).toBe("user2");

        const ctx2 = {
            inGamePlayers: ["user1", "user2", "user3"],
            userId: "user3",
            passedPlayers: [],
        };
        expect(getNextPlayer(ctx2)).toBe("user1");
    });

    test("Should skip passed players", () => {
        const ctx = {
            inGamePlayers: ["user1", "user2", "user3", "user4"],
            userId: "user1",
            passedPlayers: ["user2", "user3"],
        };
        // user1 -> user2 (passed) -> user3 (passed) -> user4
        expect(getNextPlayer(ctx)).toBe("user4");
    });

    test("Should return self if everyone else has passed (new round)", () => {
        const ctx = {
            inGamePlayers: ["user1", "user2", "user3", "user4"],
            userId: "user1",
            passedPlayers: ["user2", "user3", "user4"],
        };
        expect(getNextPlayer(ctx)).toBe("user1");
    });
});
