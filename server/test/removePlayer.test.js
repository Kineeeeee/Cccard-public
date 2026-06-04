const removePlayer = require("../engine/actions/removePlayer");
const { emitRoomState } = require("../emitters/emitRoomState");
const { getRoom, deleteRoom, removePlayerRoom } = require("../managers/roomManager");

jest.mock("../emitters/emitRoomState");
jest.mock("../managers/roomManager");

describe("removePlayer", () => {
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
            host: "user1",
            players: {
                user1: { userId: "user1", name: "Player 1" },
                user2: { userId: "user2", name: "Player 2" },
                user3: { userId: "user3", name: "Player 3" },
            },
            hands: {
                user1: [],
                user2: [],
                user3: [],
            },
            inGamePlayers: ["user1", "user2", "user3"],
            passedPlayers: ["user1"],
            turnTimer: 123,
            prepTimer: 456,
            restartTimeout: 789,
            gameStarted: true,
            gameOver: false,
        };

        getRoom.mockReturnValue(mockRoom);

        jest.spyOn(global, 'clearInterval').mockImplementation(() => {});
        jest.spyOn(global, 'clearTimeout').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("should return undefined if room does not exist", () => {
        getRoom.mockReturnValue(null);
        expect(removePlayer(mockIo, "room1", "user1")).toBeUndefined();
    });

    test("should return undefined if player does not exist", () => {
        expect(removePlayer(mockIo, "room1", "nonExistentUser")).toBeUndefined();
    });

    test("should remove player data, emit user_left and update inGamePlayers/passedPlayers", () => {
        removePlayer(mockIo, "room1", "user2");

        expect(mockIo.to).toHaveBeenCalledWith("room1");
        expect(mockIo.emit).toHaveBeenCalledWith("user_left", "Player 2");

        expect(mockRoom.players.user2).toBeUndefined();
        expect(mockRoom.hands.user2).toBeUndefined();
        expect(removePlayerRoom).toHaveBeenCalledWith("user2");

        expect(mockRoom.inGamePlayers).not.toContain("user2");
        expect(mockRoom.passedPlayers).not.toContain("user2"); // Actually wasn't in it, but shouldn't error

        expect(emitRoomState).toHaveBeenCalledWith(mockIo, mockRoom);
    });

    test("should reassign host if the leaving player was the host", () => {
        // user1 is host
        removePlayer(mockIo, "room1", "user1");

        expect(mockRoom.host).toBe("user2"); // Next available player
        expect(mockIo.emit).toHaveBeenCalledWith("host_changed", "Player 2");
    });

    test("should completely delete the room if no players remain", () => {
        // Only 1 player left
        mockRoom.players = { user1: { userId: "user1", name: "Player 1" } };
        
        removePlayer(mockIo, "room1", "user1");

        expect(global.clearInterval).toHaveBeenCalledWith(123);
        expect(global.clearInterval).toHaveBeenCalledWith(456);
        expect(global.clearTimeout).toHaveBeenCalledWith(789);
        expect(deleteRoom).toHaveBeenCalledWith("room1");
        expect(emitRoomState).not.toHaveBeenCalled(); // Room is gone
    });

    test("should stop the game if remaining players fall below 2", () => {
        // 2 players exist, 1 leaves -> 1 remaining
        mockRoom.players = {
            user1: { userId: "user1", name: "Player 1" },
            user2: { userId: "user2", name: "Player 2" },
        };

        removePlayer(mockIo, "room1", "user2");

        expect(global.clearTimeout).toHaveBeenCalledWith(789);
        expect(mockRoom.restartTimeout).toBeNull();
        expect(mockRoom.gameStarted).toBe(false);
        expect(mockRoom.gameOver).toBe(false);
    });
});
