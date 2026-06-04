import { $ } from "../utils/dom.js";

const settingsBtn = $("settingsBtn");
const settingsModal = $("settingsModal");
const closeSettingsBtn = $("closeSettingsBtn");

settingsBtn?.addEventListener("click", () => {
    settingsModal?.classList.remove("hidden");
});

closeSettingsBtn?.addEventListener("click", () => {
    settingsModal?.classList.add("hidden");
});
