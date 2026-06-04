export function getOpponentTemplate(player, state, timeLeft, totalTurnTime) {
    const isTurn =
        player.userId === state.roomState.turn && !state.roomState.gameOver;
    const isPassed = state.roomState.passedPlayers?.includes(player.userId);
    const isDisconnected = player.connected === false;
    const isHost = player.userId === state.roomState.host;

    const canKick =
        state.userId === state.roomState.host &&
        (!state.roomState.gameStarted || state.roomState.gameOver) &&
        player.userId !== state.userId;

    const timerProgress = isTurn ? (timeLeft / totalTurnTime) * 360 : 0;
    const lowTime = timeLeft <= 5;

    return `
        <div
            data-user-id="${player.userId}"
            class="player-info ${isTurn ? "active" : ""} ${isPassed ? "passed" : ""} ${lowTime && isTurn ? "low-time" : ""} ${isDisconnected ? "disconnected" : ""}"
            style="--timer-progress:${timerProgress}deg"
        >
            <div class="win-badge">${player.wins}</div>
            <div class="score-badge">🪙 ${player.score}</div>
            <div class="avatar-wrapper">
                <div class="avatar">${player.name.slice(0, 2).toUpperCase()}</div>
                ${isPassed ? `<div class="pass-text">PASS</div>` : ""}
                ${isTurn ? `<div class="turn-timer ${timeLeft <= 5 ? "low" : ""}">${timeLeft}</div>` : ""}
                ${canKick ? `<button class="kick-btn" data-id="${player.userId}">Kick</button>` : ""}
            </div>
            <div class="info">
                <div class="player-name">${player.name} ${isHost ? "👑" : ""}</div>
                <div class="cards-left">${player.cardsLeft}</div>
            </div>
            ${isDisconnected ? `<div class="disconnect-text">DISCONNECTED</div>` : ""}
        </div>
    `;
}

export function getMyPlayerTemplate(me, state, timeLeft, totalTurnTime) {
    const isTurn =
        me.userId === state.roomState.turn && !state.roomState.gameOver;
    const isPassed = state.roomState.passedPlayers?.includes(me.userId);
    const isDisconnected = me.connected === false;
    const isHost = me.userId === state.roomState.host;

    const timerProgress = isTurn ? (timeLeft / totalTurnTime) * 360 : 0;
    const lowTime = timeLeft <= 5;

    return `
        <div
            data-user-id="${me.userId}"
            class="player-info ${isTurn ? "active" : ""} ${isPassed ? "passed" : ""} ${lowTime && isTurn ? "low-time" : ""} ${isDisconnected ? "disconnected" : ""}"
            style="--timer-progress:${timerProgress}deg"
        >
            <div class="win-badge">${me.wins}</div>
            <div class="score-badge">🪙 ${me.score}</div>
            <div class="avatar-wrapper">
                <div class="avatar">${me.name.slice(0, 2).toUpperCase()}</div>
                ${isTurn ? `<div class="turn-timer ${timeLeft <= 5 ? "low" : ""}">${timeLeft}</div>` : ""}
                ${isPassed ? `<div class="pass-text">PASS</div>` : ""}
            </div>
            <div class="info">
                <div class="player-name">${me.name} ${isHost ? "👑" : ""}</div>
                <div class="cards-left">${me.cardsLeft}</div>
            </div>
            ${isDisconnected ? `<div class="disconnect-text">RECONNECTING...</div>` : ""}
        </div>
    `;
}
