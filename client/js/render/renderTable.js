import { state } from "../state/state.js";

export function renderTable() {
    const tableDiv = document.getElementById("tableCards");

    tableDiv.innerHTML = "";

    const isGameActive =
        state.roomState?.gameStarted && !state.roomState?.gameOver;

    document.getElementById("turnText").innerText =
        !isGameActive || state.roomState?.preparing
            ? ""
            : state.isMyTurn
              ? "YOUR TURN"
              : "WAITING...";

    // Render Preparation Timer if game is in "preparing" state
    const prepContainer = document.getElementById("prepTimerContainer");
    if (state.roomState?.preparing) {
        const prepTimeLeft = state.roomState.prepTimeLeft || 0;
        const totalPrepTime = state.roomState.settings?.timers?.prepTime ?? 10;
        // Calculate circle fill percentage
        const progress = (prepTimeLeft / totalPrepTime) * 360;

        prepContainer.innerHTML = `
            <div class="prep-timer-wrapper">
                <div class="prep-timer-circle" style="--prep-progress:${progress}deg">
                    ${prepTimeLeft}
                </div>
            </div>
        `;
    } else {
        prepContainer.innerHTML = "";
    }

    if (!state.roomState?.currentCards) return;

    // Card color logic
    state.roomState.currentCards.forEach((card) => {
        const div = document.createElement("div");

        const raw = card.raw;

        const isRed = raw.includes("♥") || raw.includes("♦");

        div.className = "card " + (isRed ? "red" : "");

        div.innerHTML = `
            <div>${raw.slice(0, -1)}</div>
            <div>${raw.slice(-1)}</div>
        `;

        tableDiv.appendChild(div);
    });

    const overlay = document.getElementById("pauseOverlay");
    if (state.roomState?.paused) {
        overlay.classList.remove("hidden");
    } else {
        overlay.classList.add("hidden");
    }
}
