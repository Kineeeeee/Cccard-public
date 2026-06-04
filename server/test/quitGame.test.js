const quitGame = require("../engine/actions/quitGame");
const { emitRoomState } = require("../emitters/emitRoomState");
const { createContext } = require("../engine/context");
const { getRoom, removePlayerRoom } = require("../managers/roomManager");
const stopTurnTimer = require("../timers/stopTurnTimer");
const passTurn = require("../engine/actions/passTurn");

jest.mock("../emitters/emitRoomState");
jest.mock("../engine/context");
jest.mock("../managers/roomManager");
jest.mock("../timers/stopTurnTimer");
jest.mock("../engine/actions/passTurn");

describe("quitGame", () => {
    let mockIo;
    let mockRoom;
    let mockCtx;
    let mockPlayer;

    beforeEach(() => {
        jest.clearAllMocks();
        mockIo = {
            to: jest.fn().mockReturnThis(),
            emit: jest.fn(),
        };

        mockPlayer = {
            userId: "user1",
            name: "Player 1",
            quitting: false,
            connected: true,
        };

        mockRoom = {
            id: "room1",
            players: {
                user1: mockPlayer,
                user2: { userId: "user2", name: "Player 2" },
            },
            turn: "user2",
        };

        mockCtx = {
            room: mockRoom,
            userId: "user1",
            players: mockRoom.players,
            turn: mockRoom.turn,
        };

        getRoom.mockReturnValue(mockRoom);
        createContext.mockReturnValue(mockCtx);
    });

    test("should return false if room does not exist", () => {
        getRoom.mockReturnValue(null);
        expect(quitGame(mockIo, "room1", "user1")).toBe(false);
    });

    test("should return false if player does not exist in context", () => {
        mockCtx.players = {};
        expect(quitGame(mockIo, "room1", "user1")).toBe(false);
    });

    test("should set player as quitting, emit event, and remove room mapping", () => {
        const result = quitGame(mockIo, "room1", "user1");

        expect(result).toBe(true);
        expect(mockPlayer.quitting).toBe(true);
        expect(mockPlayer.connected).toBe(false);

        expect(mockIo.to).toHaveBeenCalledWith("room1");
        expect(mockIo.emit).toHaveBeenCalledWith("player_disconnected", "Player 1");

        expect(removePlayerRoom).toHaveBeenCalledWith("user1");
    });

    test("should emit room state if it is NOT the quitting player's turn", () => {
        mockCtx.turn = "user2"; // Not user1
        quitGame(mockIo, "room1", "user1");

        expect(stopTurnTimer).not.toHaveBeenCalled();
        expect(passTurn).not.toHaveBeenCalled();
        expect(emitRoomState).toHaveBeenCalledWith(mockIo, mockRoom);
    });

    test("should stop timer and pass turn if it IS the quitting player's turn", () => {
        mockCtx.turn = "user1"; // Is user1
        quitGame(mockIo, "room1", "user1");

        expect(stopTurnTimer).toHaveBeenCalledWith(mockRoom);
        expect(passTurn).toHaveBeenCalledWith(mockIo, mockRoom, "room1", "user1", true);
        expect(emitRoomState).not.toHaveBeenCalled(); // passTurn will handle emitting state
    });
});
