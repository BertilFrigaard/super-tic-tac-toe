const http = require("http");
const WebSocket = require("ws");
const express = require("express");
const cors = require("cors");
const protocol = require("./protocol");
const { getGames, getClients, getPlayers } = require("./game");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (socket) => {
    protocol.handleClient(socket);
});

app.get("/admin", (_, res) => {
    res.json({
        games: Array.from(getGames().keys()),
        clients: Array.from(getClients().keys()),
        players: Object.fromEntries(getPlayers()),
    });
});

app.listen(3002, () => {
    console.log("App  listening on port 3002");
});

server.listen(3001, () => {
    console.log("Server is now listening on port 3001");
});
