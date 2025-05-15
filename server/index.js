const http = require("http");
const WebSocket = require("ws");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (socket) => {
    console.log("Connection recieved");
});

app.post("/createGame", (req, res) => {
    res.status(201).json({
        name: "Bertil",
        score: 200,
    });
});

server.listen(3001, () => {
    console.log("Server is now listening on port 3001");
});