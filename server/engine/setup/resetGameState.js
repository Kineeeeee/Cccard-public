function resetGameState(room) {
    room.hands = {};

    room.currentCards = null;

    room.passCount = 0;

    room.passedPlayers = [];

    room.gameOver = false;
}

module.exports = resetGameState;
