require("dotenv").config();

const express = require("express");

const http = require("http");

const { Server } = require("socket.io");

const socketSetup = require("./socket");

const removePlayer = require("./engine/actions/removePlayer");

const { getRooms } = require("./managers/roomManager");

const { startDisconnectCleanup } = require("./timers/disconnectCleanup");
const {
    PORT,

    PING_TIMEOUT,

    PING_INTERVAL,

    DISCONNECT_TIMEOUT,

    DISCONNECT_CHECK_INTERVAL,
} = require("./config/constants");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    pingTimeout: PING_TIMEOUT,

    pingInterval: PING_INTERVAL,
});

const path = require("path");

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/index.html"));
});

app.use(express.static(path.join(__dirname, "../client")));

// app.use(
//     express.static("public")
// );

startDisconnectCleanup(io);

socketSetup(io);

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
