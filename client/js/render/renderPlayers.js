import { state } from "../state/state.js";
import { socket } from "../socket/socket.js";
import {
    getOpponentTemplate,
    getMyPlayerTemplate,
} from "./templates/playerTemplates.js";

export function renderPlayers() {
    if (!state.roomState || !state.roomState.players) return;

    const players = state.roomState.players;
    const myIndex = players.findIndex((p) => p.userId === state.userId);
    if (myIndex === -1) return;

    const orderedPlayers = [];
    for (let i = 1; i < players.length; i++) {
        orderedPlayers.push(players[(myIndex + i) % players.length]);
    }

    const slots = [
        document.getElementById("leftPlayer"),
        document.getElementById("topPlayer"),
        document.getElementById("rightPlayer"),
    ];

    slots.forEach((slot) => {
        if (slot) {
            slot.innerHTML = "";
            slot.className = "player-slot";
        }
    });

    orderedPlayers.forEach((player, index) => {
        const slot = slots[index];
        if (!slot) return;
        renderPlayer(slot, player);
    });

    renderMyPlayer(players);
}

function renderPlayer(slot, player) {
    const timeLeft = state.roomState.turnTimeLeft ?? 15;
    const totalTurnTime = state.roomState.settings?.timers?.turnTime ?? 15;

    slot.className = "player-slot";
    slot.innerHTML = getOpponentTemplate(
        player,
        state,
        timeLeft,
        totalTurnTime,
    );

    const kickBtn = slot.querySelector(".kick-btn");
    if (kickBtn) {
        kickBtn.addEventListener("click", () => {
            socket.emit("kick_player", {
                roomId: state.currentRoom,
                userId: state.userId,
                targetId: player.userId,
            });
        });
    }
}

function renderMyPlayer(players) {
    const me = players.find((p) => p.userId === state.userId);
    const slot = document.getElementById("bottomPlayer");
    const handDiv = document.getElementById("hand");

    if (!slot || !me) return;

    const timeLeft = state.roomState.turnTimeLeft ?? 15;
    const totalTurnTime = state.roomState.settings?.timers?.turnTime ?? 15;

    slot.className = "player-slot";
    slot.innerHTML = getMyPlayerTemplate(me, state, timeLeft, totalTurnTime);
    slot.appendChild(handDiv);
}
