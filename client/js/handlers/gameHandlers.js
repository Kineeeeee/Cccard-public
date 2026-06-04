import { socket } from "../socket/socket.js";
import { state } from "../state/state.js";
import { $ } from "../utils/dom.js";

$("playBtn")?.addEventListener("click", () => {
    if (!state.isMyTurn) return;
    if (state.selectedCards.length === 0) return;

    socket.emit("play_card", {
        roomId: state.currentRoom,
        userId: state.userId,
        cards: state.selectedCards,
    });

    state.selectedCards = [];
});

$("passBtn")?.addEventListener("click", () => {
    if (!state.isMyTurn) return;
    if (!state.currentCards) return;

    socket.emit("pass_turn", {
        roomId: state.currentRoom,
        userId: state.userId,
    });
});

$("declareBtn")?.addEventListener("click", () => {
    if (!state.roomState || !state.roomState.preparing) return;

    socket.emit("declare", {
        roomId: state.currentRoom,
        userId: state.userId,
    });
});

$("sortBtn")?.addEventListener("click", () => {
    if (!state.hand || state.hand.length === 0) return;

    socket.emit("sort_hand", {
        roomId: state.currentRoom,
        userId: state.userId,
    });
});
