import { socket } from "../../socket/socket.js";
import { state } from "../../state/state.js";
import { render } from "../../render/render.js";
import { renderPlayers } from "../../render/renderPlayers.js";
import { renderHand } from "../../render/renderHand.js";
import { renderSettings } from "../../render/renderSettings.js";
import { addLog } from "../../utils/logs.js";
import { enterGame } from "../../utils/enterGame.js";

export async function handleRoomCreated(roomId) {
    state.currentRoom = roomId;
    document.getElementById("roomText").innerText = `Room: ${roomId}`;
    addLog(`Room created: ${roomId}`);
    enterGame();
}

export async function handlePlayersUpdate(players) {
    state.players = players;
    renderPlayers();
}

export async function handleUserJoined(name) {
    addLog(`${name} joined room`);
}

export async function handleDealCards() {
    state.isDealing = true;
    const deck = document.getElementById("centerDeck");
    if (deck) deck.classList.remove("hidden");
}

export async function handleYourHand(cards) {
    state.hand = cards;
    state.selectedCards = [];

    renderHand();

    if (state.isDealing) {
        // 13 cards * 0.1s delay = 1.3s + 0.3s anim duration = 1.6s approx.
        await new Promise((r) => setTimeout(r, 1600));
        state.isDealing = false;
        const deck = document.getElementById("centerDeck");
        if (deck) deck.classList.add("hidden");

        // Auto-sort hand after deal animation finishes
        socket.emit("sort_hand", {
            roomId: state.currentRoom,
            userId: state.userId,
        });
    }
}

export async function handleRoomStateUpdate(roomState) {
    state.roomState = roomState;
    state.players = roomState.players;
    state.currentCards = roomState.currentCards;
    state.isMyTurn = roomState.turn === state.userId;

    const overlay = document.getElementById("pauseOverlay");
    if (overlay) {
        if (roomState.paused) {
            overlay.classList.remove("hidden");
        } else {
            overlay.classList.add("hidden");
        }
    }

    enterGame();
    render();

    // Add a small delay to ensure UI smooth updates
    await new Promise((r) => setTimeout(r, 50));
}

export async function handleSettingsUpdated(settings) {
    state.roomState.settings = settings;
    renderSettings();
}

export async function handleHostChanged(name) {
    addLog(`${name} is now host`);
}

export async function handleUserLeft(name) {
    addLog(`${name} has left the room`);
}
