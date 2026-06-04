import { renderHand } from "./renderHand.js";
import { renderPlayers } from "./renderPlayers.js";
import { renderTable } from "./renderTable.js";
import { renderLogs } from "./renderLogs.js";
import { renderSettings } from "./renderSettings.js";
import { renderButtons } from "./renderButtons.js";
import { state } from "../state/state.js";

export function render() {
    renderHand();
    renderPlayers();
    renderTable();
    renderLogs();
    renderSettings();
    renderButtons();
}
