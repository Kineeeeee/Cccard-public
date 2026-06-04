import { socket } from "../socket.js";
import { state } from "../../state/state.js";

import { addLog } from "../../utils/logs.js";
import { enterGame } from "../../utils/enterGame.js";

socket.on("connect", () => {
    state.myId = socket.id;

    socket.emit("reconnect_player", {
        userId: state.userId,
    });
});

socket.on("reconnected", (roomId) => {
    document.getElementById("roomText").innerText = `Room: ${roomId}`;

    state.currentRoom = roomId;

    enterGame();
});

socket.on("player_disconnected", (name) => {
    addLog(`${name} has disconnected`);
});

socket.on("player_reconnected", (name) => {
    addLog(`${name} has reconnected`);
});
