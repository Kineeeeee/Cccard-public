import { socket } from "../socket.js";

import { addLog } from "../../utils/logs.js";

socket.on("kicked", () => {
    alert("You were kicked from the room");

    location.reload();
});

socket.on("game_paused", () => {
    document.getElementById("pauseOverlay").classList.remove("hidden");

    addLog("game paused");
});

socket.on("game_resumed", () => {
    document.getElementById("pauseOverlay").classList.add("hidden");

    addLog("game resumed");
});
