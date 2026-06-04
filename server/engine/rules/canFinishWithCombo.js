const detectTwos = require("../detect/detectTwos");
const detectQuad = require("../detect/detectQuad");

function canFinishWithCombo(cards, settings) {
    if (!settings.rules.allowFinishWithTwos && detectTwos(cards)) {
        return false;
    }

    if (!settings.rules.allowFinishWithQuad && detectQuad(cards)) {
        return false;
    }

    return true;
}

module.exports = canFinishWithCombo;
