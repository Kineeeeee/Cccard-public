import { socket } from "../socket/socket.js";
import { state } from "../state/state.js";
import { $ } from "../utils/dom.js";

$("createBtn")?.addEventListener("click", () => {
    const name = $("nameInput").value.trim();

    socket.emit("create_room", {
        userId: state.userId,
        name,
    });
});

$("joinBtn")?.addEventListener("click", () => {
    const name = $("nameInput").value.trim();
    const roomId = $("roomInput").value.trim();

    state.currentRoom = roomId;

    $("roomText").innerText = `Room: ${roomId}`;

    socket.emit("join_room", {
        roomId,
        userId: state.userId,
        name,
    });
});

$("startBtn")?.addEventListener("click", () => {
    socket.emit("start_game", {
        roomId: state.currentRoom,
        userId: state.userId,
    });
});

$("pauseBtn")?.addEventListener("click", () => {
    socket.emit("pause_game", {
        roomId: state.currentRoom,
        userId: state.userId,
    });
});

$("quitBtn")?.addEventListener("click", () => {
    socket.emit("leave_room", {
        roomId: state.currentRoom,
        userId: state.userId,
    });

    location.reload();
});
