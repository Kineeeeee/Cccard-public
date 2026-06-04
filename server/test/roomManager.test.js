const {
    createRoom,
    getRoom,
    getRooms,
    deleteRoom,
    setPlayerRoom,
    getPlayerRoom,
    removePlayerRoom,
} = require("../managers/roomManager");

describe("roomManager", () => {
    test("Room CRUD operations", () => {
        const room = { id: "room1", data: "test" };
        createRoom("room1", room);

        expect(getRoom("room1")).toBe(room);
        expect(getRooms()).toHaveProperty("room1");

        deleteRoom("room1");
        expect(getRoom("room1")).toBeUndefined();
    });

    test("Player Room mapping", () => {
        setPlayerRoom("user1", "room1");
        expect(getPlayerRoom("user1")).toBe("room1");

        removePlayerRoom("user1");
        expect(getPlayerRoom("user1")).toBeUndefined();
    });
});
