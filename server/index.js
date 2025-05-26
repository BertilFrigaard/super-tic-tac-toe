const http = require("http");
const WebSocket = require("ws");
const express = require("express");
const protocol = require("./protocol");

const app = express();
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (socket) => {
    protocol.handleClient(socket);
});

app.use(express.static("../client/dist"));

server.listen(3000, () => {
    console.log("Server is now listening on port 3000");
});
