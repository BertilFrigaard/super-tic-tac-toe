const http = require("http");
const WebSocket = require("ws");
const express = require("express");
const cors = require("cors");
const protocol = require("./protocol");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (socket) => {
    protocol.handleClient(socket);
});

server.listen(3001, () => {
    console.log("Server is now listening on port 3001");
});