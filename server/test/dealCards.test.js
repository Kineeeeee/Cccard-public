const dealCards = require("../engine/setup/dealCards");

describe("dealCards", () => {
    test("Should deal correct number of cards to all players", () => {
        const room = {
            settings: {
                rules: {
                    cardsPerPlayer: 13,
                },
            },
            inGamePlayers: ["p1", "p2", "p3", "p4"],
            hands: {},
        };

        dealCards(room);

        expect(Object.keys(room.hands).length).toBe(4);
        expect(room.hands["p1"].length).toBe(13);
        expect(room.hands["p2"].length).toBe(13);
        expect(room.hands["p3"].length).toBe(13);
        expect(room.hands["p4"].length).toBe(13);

        // Cards should be normalized objects, check one property
        expect(room.hands["p1"][0]).toHaveProperty("suitValue");
        expect(room.hands["p1"][0]).toHaveProperty("rankValue");
    });
});
