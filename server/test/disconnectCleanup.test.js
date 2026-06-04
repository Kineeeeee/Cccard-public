const { startDisconnectCleanup } = require("../timers/disconnectCleanup");
const removePlayer = require("../engine/actions/removePlayer");
const quitGame = require("../engine/actions/quitGame");
const { getRooms } = require("../managers/roomManager");
const { DISCONNECT_TIMEOUT, DISCONNECT_CHECK_INTERVAL } = require("../config/constants");

jest.mock("../engine/actions/removePlayer");
jest.mock("../engine/actions/quitGame");
jest.mock("../managers/roomManager");

describe("disconnectCleanup", () => {
    let mockIo;

    beforeEach(() => {
        jest.useFakeTimers();
        jest.clearAllMocks();
        mockIo = {
            to: jest.fn().mockReturnThis(),
            emit: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
    });

    test("should remove player if disconnected for >= timeout and game not started", () => {
        const mockRooms = {
            room1: {
                gameStarted: false,
                players: {
                    user1: {
                        userId: "user1",
                        connected: false,
                        disconnectedAt: Date.now() - DISCONNECT_TIMEOUT - 1000,
                        quitting: false,
                    },
                },
            },
        };

        getRooms.mockReturnValue(mockRooms);

        startDisconnectCleanup(mockIo);
        jest.advanceTimersByTime(DISCONNECT_CHECK_INTERVAL);

        expect(removePlayer).toHaveBeenCalledWith(mockIo, "room1", "user1");
        expect(quitGame).not.toHaveBeenCalled();
    });

    test("should call quitGame (ghost player) if game started and player is in game", () => {
        const mockRooms = {
            room1: {
                gameStarted: true,
                inGamePlayers: ["user1", "user2"],
                players: {
                    user1: {
                        userId: "user1",
                        connected: false,
                        disconnectedAt: Date.now() - DISCONNECT_TIMEOUT - 1000,
                        quitting: false,
                    },
                },
            },
        };

        getRooms.mockReturnValue(mockRooms);

        startDisconnectCleanup(mockIo);
        jest.advanceTimersByTime(DISCONNECT_CHECK_INTERVAL);

        expect(quitGame).toHaveBeenCalledWith(mockIo, "room1", "user1");
        expect(removePlayer).not.toHaveBeenCalled();
    });

    test("should not do anything if player disconnected time is < timeout", () => {
        const mockRooms = {
            room1: {
                gameStarted: true,
                inGamePlayers: ["user1", "user2"],
                players: {
                    user1: {
                        userId: "user1",
                        connected: false,
                        disconnectedAt: Date.now() - 1000, // Only 1 second ago
                        quitting: false,
                    },
                },
            },
        };

        getRooms.mockReturnValue(mockRooms);

        startDisconnectCleanup(mockIo);
        jest.advanceTimersByTime(DISCONNECT_CHECK_INTERVAL);

        expect(quitGame).not.toHaveBeenCalled();
        expect(removePlayer).not.toHaveBeenCalled();
    });

    test("should not do anything if player is connected", () => {
        const mockRooms = {
            room1: {
                gameStarted: true,
                inGamePlayers: ["user1", "user2"],
                players: {
                    user1: {
                        userId: "user1",
                        connected: true, // Connected
                        disconnectedAt: null,
                        quitting: false,
                    },
                },
            },
        };

        getRooms.mockReturnValue(mockRooms);

        startDisconnectCleanup(mockIo);
        jest.advanceTimersByTime(DISCONNECT_CHECK_INTERVAL);

        expect(quitGame).not.toHaveBeenCalled();
        expect(removePlayer).not.toHaveBeenCalled();
    });

    test("should not call quitGame if player is already quitting (ghost)", () => {
        const mockRooms = {
            room1: {
                gameStarted: true,
                inGamePlayers: ["user1", "user2"],
                players: {
                    user1: {
                        userId: "user1",
                        connected: false,
                        disconnectedAt: Date.now() - DISCONNECT_TIMEOUT - 1000,
                        quitting: true, // Already quitting
                    },
                },
            },
        };

        getRooms.mockReturnValue(mockRooms);

        startDisconnectCleanup(mockIo);
        jest.advanceTimersByTime(DISCONNECT_CHECK_INTERVAL);

        expect(quitGame).not.toHaveBeenCalled();
        expect(removePlayer).not.toHaveBeenCalled();
    });

    test("should call removePlayer if game is started but player is NOT in inGamePlayers (spectator/lobby bug)", () => {
        const mockRooms = {
            room1: {
                gameStarted: true,
                inGamePlayers: ["user2", "user3"], // user1 is not here
                players: {
                    user1: {
                        userId: "user1",
                        connected: false,
                        disconnectedAt: Date.now() - DISCONNECT_TIMEOUT - 1000,
                        quitting: false,
                    },
                },
            },
        };

        getRooms.mockReturnValue(mockRooms);

        startDisconnectCleanup(mockIo);
        jest.advanceTimersByTime(DISCONNECT_CHECK_INTERVAL);

        expect(removePlayer).toHaveBeenCalledWith(mockIo, "room1", "user1");
        expect(quitGame).not.toHaveBeenCalled();
    });
});
