const { getFirstPlayer } = require("../engine/rules/getFirstPlayer");

describe("getFirstPlayer", () => {
    test("should return declareWinner if someone declared", () => {
        const ctx = {
            room: {
                declareWinner: "player_3",
            },
            settings: {
                rules: { firstTurnMode: "3_spade" },
            },
            inGamePlayers: ["player_1", "player_2", "player_3", "player_4"],
            hands: {
                player_1: [{ rankValue: 1, suitValue: 0 }], // Has 3 Spade
                player_2: [],
                player_3: [],
                player_4: [],
            },
        };

        const result = getFirstPlayer(ctx);
        // Should ignore 3 Spade and give turn to declareWinner
        expect(result).toBe("player_3");
    });
});
