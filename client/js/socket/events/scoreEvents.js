import { socket } from "../socket.js";

import { showFloatingScore } from "../../render/renderScores.js";

socket.on("score_update", ({ changes }) => {
    changes.forEach((c) => {
        showFloatingScore(c.userId, c.delta);
    });
});
