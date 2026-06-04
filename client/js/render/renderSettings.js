import { state } from "../state/state.js";
import { socket } from "../socket/socket.js";

export function renderSettings() {
    const el = document.getElementById("settingsList");
    const modal = document.getElementById("settingsModal");
    if (!el || (modal && !modal.classList.contains("hidden"))) return;

    const rules = state.roomState.settings.rules;
    const scoring = state.roomState.settings.scoring;

    el.innerHTML = `
        <div class="settings-grid">
            <div class="settings-section">
                <h3>Game Rules</h3>
                
                <div class="setting-item">
                    <label>Cards per player:</label>
                    <select id="set_cardsPerPlayer">
                        <option value="13" ${rules.cardsPerPlayer === 13 ? "selected" : ""}>13 Cards (Standard)</option>
                        <option value="10" ${rules.cardsPerPlayer === 10 ? "selected" : ""}>10 Cards</option>
                    </select>
                </div>

                <div class="setting-item">
                    <label>First Turn Mode:</label>
                    <select id="set_firstTurnMode">
                        <option value="random" ${rules.firstTurnMode === "random" ? "selected" : ""}>Random Player</option>
                        <option value="winner" ${rules.firstTurnMode === "winner" ? "selected" : ""}>Previous Winner</option>
                        <option value="3_spade" ${rules.firstTurnMode === "3_spade" ? "selected" : ""}>Player with 3♠</option>
                    </select>
                </div>

                <div class="setting-item checkbox-item">
                    <input type="checkbox" id="set_compareSuit" ${rules.compareSuit ? "checked" : ""}>
                    <label for="set_compareSuit">Compare Suits (e.g., 2♥ beats 2♠)</label>
                </div>
                
                <div class="setting-item checkbox-item">
                    <input type="checkbox" id="set_allowConsecutivePair" ${rules.allowConsecutivePair ? "checked" : ""}>
                    <label for="set_allowConsecutivePair">Allow Consecutive Pairs</label>
                </div>

                <div class="setting-item checkbox-item">
                    <input type="checkbox" id="set_allowFinishWithTwos" ${rules.allowFinishWithTwos ? "checked" : ""}>
                    <label for="set_allowFinishWithTwos">Allow finishing with a 2</label>
                </div>

                <div class="setting-item checkbox-item">
                    <input type="checkbox" id="set_allowA23Straight" ${rules.allowA23Straight ? "checked" : ""}>
                    <label for="set_allowA23Straight">Allow Straights with 2 (e.g. A-2-3, 2-3-4)</label>
                </div>

                <div class="setting-item checkbox-item">
                    <input type="checkbox" id="set_allowFinishWithQuad" ${rules.allowFinishWithQuad ? "checked" : ""}>
                    <label for="set_allowFinishWithQuad">Allow finishing with a Quad</label>
                </div>

                <div class="setting-item checkbox-item">
                    <input type="checkbox" id="set_mustPlayHighestWhenOpponentOneCard" ${rules.mustPlayHighestWhenOpponentOneCard ? "checked" : ""}>
                    <label for="set_mustPlayHighestWhenOpponentOneCard">Must play highest card if opponent has 1 card</label>
                </div>
            </div>

            <div class="settings-section">
                <h3>Scoring (Penalties)</h3>
                
                <div class="setting-item">
                    <label>Normal Card Penalty (per card):</label>
                    <input type="number" id="set_normalPen" min="0" value="${scoring.normalPen}">
                </div>

                <div class="setting-item">
                    <label>Penalty for holding a 2:</label>
                    <input type="number" id="set_twosPen" min="0" value="${scoring.twosPen}">
                </div>

                <div class="setting-item">
                    <label>Penalty for holding a Quad:</label>
                    <input type="number" id="set_quadPen" min="0" value="${scoring.quadPen}">
                </div>

                <div class="setting-item">
                    <label>Penalty for holding Consecutive Pairs:</label>
                    <input type="number" id="set_consPairPen" min="0" value="${scoring.consPairPen}">
                </div>

                <div class="setting-item">
                    <label>Base Chop Penalty (per chopped 2, Quad, etc.):</label>
                    <input type="number" id="set_chopPen" min="0" value="${scoring.chopPen}">
                </div>
            </div>
            <div class="settings-section">
                <h3>Timers</h3>
                
                <div class="setting-item">
                    <label>Preparation Time (seconds):</label>
                    <input type="number" id="set_prepTime" min="0" value="${state.roomState.settings.timers?.prepTime ?? 10}">
                </div>

                <div class="setting-item">
                    <label>Turn Time (seconds):</label>
                    <input type="number" id="set_turnTime" min="5" value="${state.roomState.settings.timers?.turnTime ?? 15}">
                </div>
            </div>
        </div>

        <button id="saveSettingsBtn">Save Settings</button>
    `;

    const btn = document.getElementById("saveSettingsBtn");
    btn.onclick = () => {
        const getVal = (id) => document.getElementById(id).value;
        const getBool = (id) => document.getElementById(id).checked;

        socket.emit("update_settings", {
            roomId: state.currentRoom,
            userId: state.userId,
            settings: {
                rules: {
                    cardsPerPlayer: Number(getVal("set_cardsPerPlayer")),
                    firstTurnMode: getVal("set_firstTurnMode"),
                    compareSuit: getBool("set_compareSuit"),
                    allowConsecutivePair: getBool("set_allowConsecutivePair"),
                    allowFinishWithTwos: getBool("set_allowFinishWithTwos"),
                    allowA23Straight: getBool("set_allowA23Straight"),
                    allowFinishWithQuad: getBool("set_allowFinishWithQuad"),
                    mustPlayHighestWhenOpponentOneCard: getBool(
                        "set_mustPlayHighestWhenOpponentOneCard",
                    ),
                },
                scoring: {
                    normalPen: Number(getVal("set_normalPen")),
                    twosPen: Number(getVal("set_twosPen")),
                    quadPen: Number(getVal("set_quadPen")),
                    consPairPen: Number(getVal("set_consPairPen")),
                    chopPen: Number(getVal("set_chopPen")),
                },
                timers: {
                    prepTime: Number(getVal("set_prepTime")),
                    turnTime: Number(getVal("set_turnTime")),
                },
            },
        });

        // Close modal
        document.getElementById("settingsModal").classList.add("hidden");
    };
}
