const handleDeclareLoss = require("../engine/actions/handleDeclareLoss");
const { getRoom, createRoom, addPlayer } = require("../managers/roomManager");

describe("handleDeclareLoss", () => {
    let ioMock;
    let startGameMock;

    beforeEach(() => {
        ioMock = { to: jest.fn().mockReturnThis(), emit: jest.fn() };
        startGameMock = jest.fn();
    });

    test("should correctly deduct penalty from declarer and give to others", () => {
        const roomObj = {
            id: "r1",
            players: {
                p1: { name: "Player 1", socketId: "s1", wins: 0, score: 0 },
                p2: { name: "Player 2", socketId: "s2", wins: 0, score: 0 },
                p3: { name: "Player 3", socketId: "s3", wins: 0, score: 0 },
                p4: { name: "Player 4", socketId: "s4", wins: 0, score: 0 },
            },
            inGamePlayers: ["p1", "p2", "p3", "p4"],
            settings: {
                rules: { cardsPerPlayer: 13 },
                scoring: { normalPen: 1 },
            },
            hands: { p1: [], p2: [], p3: [], p4: [] },
            gameOver: false,
        };
        createRoom("r1", roomObj);

        const room = getRoom("r1");

        // p1 declared, p2 intercepted
        handleDeclareLoss(ioMock, "r1", startGameMock, "p1", "p2");

        expect(room.gameOver).toBe(true);

        // p2, p3, p4 should gain 13 each. p1 loses 39.
        expect(room.players.p2.score).toBe(13);
        expect(room.players.p3.score).toBe(13);
        expect(room.players.p4.score).toBe(13);
        expect(room.players.p1.score).toBe(-39);

        // Interceptor should get 1 win
        expect(room.players["p2"].wins).toBe(1);
    });
});
