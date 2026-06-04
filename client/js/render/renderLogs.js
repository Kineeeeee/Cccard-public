import { state } from "../state/state.js";

export function renderLogs() {
    const logsDiv = document.getElementById("logs");

    logsDiv.innerHTML = "";

    state.logs.forEach((log) => {
        const div = document.createElement("div");

        div.innerText = log;

        logsDiv.appendChild(div);
    });
}
