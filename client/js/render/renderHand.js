import { state } from "../state/state.js";
import { socket } from "../socket/socket.js";

export function checkSelectedCardsValidity() {
    const playBtn = document.getElementById("playBtn");
    if (!playBtn) return;

    if (
        !state.isMyTurn ||
        !state.selectedCards ||
        state.selectedCards.length === 0
    ) {
        playBtn.classList.remove("valid-play");
        return;
    }

    socket.emit("validate_selected_cards", {
        roomId: state.currentRoom,
        userId: state.userId,
        cards: state.selectedCards,
    });
}

export function renderHand() {
    const handDiv = document.getElementById("hand");

    handDiv.innerHTML = "";

    if (state.isDealing) {
        handDiv.classList.add("is-dealing");
    } else {
        handDiv.classList.remove("is-dealing");
    }

    (state.hand || []).forEach((card, index) => {
        const div = document.createElement("div");

        const isRed = card.includes("♥") || card.includes("♦");

        div.className =
            "card " +
            (isRed ? "red " : "") +
            (state.selectedCards.includes(card) ? "selected " : "") +
            (state.isDealing ? "deal-anim" : "");

        if (state.isDealing) {
            div.style.animationDelay = `${index * 0.1}s`;
        }

        div.innerHTML = `
            <div>${card.slice(0, -1)}</div>
            <div>${card.slice(-1)}</div>
        `;

        // Enable Drag and Drop
        div.setAttribute("draggable", "true");

        div.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", index);
            div.classList.add("dragging");
            e.dataTransfer.effectAllowed = "move";
        });

        div.addEventListener("dragover", (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
        });

        div.addEventListener("drop", (e) => {
            e.preventDefault();
            const draggedIndex = parseInt(e.dataTransfer.getData("text/plain"));
            const targetIndex = index;

            if (!isNaN(draggedIndex) && draggedIndex !== targetIndex) {
                const draggedCard = state.hand[draggedIndex];
                state.hand.splice(draggedIndex, 1);
                state.hand.splice(targetIndex, 0, draggedCard);
                renderHand();
            }
        });

        div.addEventListener("dragend", () => {
            div.classList.remove("dragging");
        });

        div.onclick = () => {
            if (!state.isMyTurn) return;

            if (state.selectedCards.includes(card)) {
                state.selectedCards = state.selectedCards.filter(
                    (c) => c !== card,
                );
            } else {
                state.selectedCards.push(card);
            }
            renderHand();
            checkSelectedCardsValidity();
        };

        handDiv.appendChild(div);
    });

    checkSelectedCardsValidity();
}
