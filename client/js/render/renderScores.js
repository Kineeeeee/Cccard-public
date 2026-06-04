export function showFloatingScore(userId, delta) {
    const playerEl = document.querySelector(`[data-user-id="${userId}"]`);

    if (!playerEl) return;

    const rect = playerEl.getBoundingClientRect();

    const floating = document.createElement("div");

    floating.classList.add("floating-score");

    if (delta >= 0) {
        floating.classList.add("positive");

        floating.textContent = `+${delta}`;
    } else {
        floating.classList.add("negative");

        floating.textContent = `${delta}`;
    }

    floating.style.left = `${rect.left + rect.width / 2}px`;

    floating.style.top = `${rect.top}px`;

    document.getElementById("effects-layer").appendChild(floating);

    setTimeout(() => {
        floating.remove();
    }, 2500);
}
