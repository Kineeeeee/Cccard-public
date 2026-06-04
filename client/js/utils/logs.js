import { state } from "../state/state.js";
import { renderLogs } from "../render/renderLogs.js";

export function addLog(text) {
    state.logs.push(text);

    if (state.logs.length > 50) {
        state.logs.shift();
    }

    renderLogs();
}
