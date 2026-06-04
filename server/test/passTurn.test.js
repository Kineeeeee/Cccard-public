const passTurn = require("../engine/actions/passTurn");
const { emitRoomState } = require("../emitters/emitRoomState");
const startTurnTimer = require("../timers/startTurnTimer");
const resetRound = require("../engine/actions/resetRound");

jest.mock("../emitters/emitRoomState");
jest.mock("../timers/startTurnTimer");
jest.mock("../engine/actions/resetRound");

describe("passTurn", () => {
    let mockIo;
    let mockRoom;

    beforeEach(() => {
        jest.clearAllMocks();
        mockIo = {
            to: jest.fn().mockReturnThis(),
            emit: jest.fn(),
        };

        mockRoom = {
            id: "room1",
            players: {
                user1: { userId: "user1", name: "Player 1" },
                user2: { userId: "user2", name: "Player 2" },
                user3: { userId: "user3", name: "Player 3" },
            },
            inGamePlayers: ["user1", "user2", "user3"],
            passedPlayers: [],
            currentCards: [{}],
            turn: "user1",
            lastPlayer: "user3",
            passCount: 0,
            turnTimer: 123,
            gameStarted: true,
        };

        jest.spyOn(global, 'clearInterval').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("should return early if not player's turn", () => {
        passTurn(mockIo, mockRoom, "room1", "user2", false);
        expect(mockIo.emit).not.toHaveBeenCalled();
    });

    test("should return early if room is paused", () => {
        mockRoom.paused = true;
        passTurn(mockIo, mockRoom, "room1", "user1", false);
        expect(mockIo.emit).not.toHaveBeenCalled();
    });

    test("should add player to passedPlayers and increment passCount", () => {
        passTurn(mockIo, mockRoom, "room1", "user1", false);

        expect(mockRoom.passedPlayers).toContain("user1");
        expect(mockRoom.passCount).toBe(1);
        expect(mockIo.to).toHaveBeenCalledWith("room1");
        expect(mockIo.emit).toHaveBeenCalledWith("player_passed", {
            player: "Player 1",
            turn: "user2",
            timedOut: false,
            isNewRound: false,
        });
    });

    test("should reset round if all other active players have passed", () => {
        // 3 players, user1 passes. If passCount reaches 2, round resets.
        mockRoom.passCount = 1;
        mockRoom.passedPlayers = ["user2"];
        
        passTurn(mockIo, mockRoom, "room1", "user1", false);

        expect(resetRound).toHaveBeenCalledWith(mockIo, mockRoom);
        
        // Since resetRound is mocked, we just check that the turn logic would have shifted
        // In the real code, resetRound resets passedPlayers and passCount, then sets turn to lastPlayer.
        expect(mockRoom.turn).toBe("user3"); // lastPlayer
        expect(startTurnTimer).toHaveBeenCalled();
        expect(emitRoomState).toHaveBeenCalledWith(mockIo, mockRoom);
    });

    test("should pass turn to next available player", () => {
        passTurn(mockIo, mockRoom, "room1", "user1", false);

        // Turn shifts to user2
        expect(mockRoom.turn).toBe("user2");
        expect(startTurnTimer).toHaveBeenCalled();
        expect(emitRoomState).toHaveBeenCalledWith(mockIo, mockRoom);
    });

    test("should safely handle if a player is missing from room.players (ghost cleanup bug)", () => {
        // Reproducing the specific bug we fixed earlier where room.players[userId] was undefined
        mockRoom.players = {}; // Empty

        expect(() => {
            passTurn(mockIo, mockRoom, "room1", "user1", true);
        }).not.toThrow();

        expect(mockIo.emit).toHaveBeenCalledWith("player_passed", {
            player: "Unknown", // Fallback works
            turn: "user2",
            timedOut: true,
            isNewRound: false,
        });
    });
});
