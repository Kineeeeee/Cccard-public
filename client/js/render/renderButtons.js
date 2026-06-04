import { state } from "../state/state.js";

export function renderButtons() {
    const actionButtons = document.querySelector(".action-buttons");
    const declareBtn = document.getElementById("declareBtn");
    const playBtn = document.getElementById("playBtn");
    const passBtn = document.getElementById("passBtn");
    const sortBtn = document.getElementById("sortBtn");

    if (actionButtons && state.roomState) {
        // Only show buttons during Prep phase or if it's currently the player's turn in-game
        const isPreparing =
            state.roomState.preparing && !state.roomState.gameOver;
        const isPlaying =
            state.roomState.gameStarted &&
            !state.roomState.preparing &&
            !state.roomState.gameOver;

        const showActionButtons = (isPreparing || (isPlaying && state.isMyTurn)) && !state.roomState.paused;
        actionButtons.style.display = showActionButtons ? "flex" : "none";

        if (declareBtn) {
            declareBtn.style.display =
                isPreparing && !state.roomState.declareWinner
                    ? "block"
                    : "none";
        }

        if (playBtn) {
            playBtn.style.display =
                isPlaying && state.isMyTurn ? "block" : "none";
        }

        if (passBtn) {
            passBtn.style.display =
                isPlaying && state.isMyTurn ? "block" : "none";
        }
    }

    if (sortBtn && state.roomState) {
        const isGameActive =
            state.roomState.gameStarted && !state.roomState.gameOver;
        sortBtn.style.display = isGameActive ? "block" : "none";
    }
}
