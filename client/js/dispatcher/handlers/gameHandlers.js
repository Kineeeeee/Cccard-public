import { state } from "../../state/state.js";
import { renderPlayers } from "../../render/renderPlayers.js";
import { renderTable } from "../../render/renderTable.js";
import { renderButtons } from "../../render/renderButtons.js";
import { addLog } from "../../utils/logs.js";

export async function handleCardPlayed(data) {
    addLog(`${data.player} played ${data.cards.join(" ")}`);
}

export async function handlePlayerDeclared({ playerName }) {
    addLog(`${playerName} has declared`);
}

export async function handleRoundReset() {
    state.roomState.currentCards = null;
    renderTable();
}

export async function handlePlayerPassed(data) {
    if (data.timedOut) {
        addLog(`${data.player} timed out`);
    } else {
        addLog(`${data.player} passed`);
    }

    if (data.isNewRound) {
        addLog("reset round");
    }
}

export async function handleGameOver(data) {
    const wt = document.getElementById("gameOver");
    if (!wt) return;

    wt.innerHTML = `
        <div>WINNER: ${data.winner}</div>
        ${data.reason ? `<div>REASON: ${data.reason}</div>` : ""}
    `;
    addLog(`${data.winner} won the game`);

    setTimeout(() => {
        wt.innerText = "";
    }, 5000);
}

export async function handleTurnTimerUpdate({ timeLeft }) {
    state.roomState.turnTimeLeft = timeLeft;
    renderPlayers();
}

export async function handleTurnTimerStarted({ timeLeft }) {
    state.roomState.turnTimeLeft = timeLeft;
    renderPlayers();
}

export async function handlePrepStarted(timeLeft) {
    if (state.roomState) {
        state.roomState.preparing = true;
        state.roomState.prepTimeLeft = timeLeft;
        renderTable();
        renderButtons();
    }
}

export async function handlePrepTimerUpdate(timeLeft) {
    if (state.roomState) {
        state.roomState.prepTimeLeft = timeLeft;
        renderTable();
    }
}

export async function handleValidateSelectedCardsResult({ valid }) {
    const playBtn = document.getElementById("playBtn");
    if (playBtn) {
        if (valid) {
            playBtn.classList.add("valid-play");
        } else {
            playBtn.classList.remove("valid-play");
        }
    }
}
