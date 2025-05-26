const {
    createClient,
    createGame,
    clientInGame,
    linkClientToGame,
    gameExists,
    deleteClient,
    startGame,
    gameIsFull,
    gameIsActive,
    getGameByClient,
    getClientsByGame,
    getSocketByClient,
    getGameJson,
    isClientsTurn,
    clientPlace,
    updateAvailableGrids,
    swapGameTurn,
    updateGridResults,
    updateWinner,
    deletePlayer,
    deleteGame,
} = require("./game");

function handleClient(socket) {
    const clientId = createClient(socket);

    socket.on("message", (msg) => {
        if (clientInGame(clientId)) {
            if (gameIsActive(getGameByClient(clientId))) {
                handleGameMsg(socket, clientId, msg);
                return;
            }
        }
        handleIdleMsg(socket, clientId, msg);
    });

    socket.on("close", () => {
        if (clientInGame(clientId)) {
            const gameId = getGameByClient(clientId);
            const clients = getClientsByGame(gameId);
            for (let curClientId of clients) {
                deletePlayer(curClientId);
                if (curClientId != clientId) {
                    const curSocket = getSocketByClient(curClientId);
                    if (curSocket) {
                        curSocket.close();
                    }
                }
            }
            deleteGame(gameId);
        }
        deleteClient(clientId);
    });
}

function handleIdleMsg(socket, clientId, msg) {
    const args = msg.toString().split(";");

    if (args[0] == "create-game") {
        if (clientInGame(clientId)) {
            socket.send("error;You are already connected to a game");
            return;
        }
        const joinCode = createGame();
        const linkStatus = linkClientToGame(joinCode, clientId);
        if (!linkStatus) {
            socket.send("error;Could not connect to game");
            return;
        }
        socket.send("game-joined;" + joinCode);
    } else if (args[0] == "join-game") {
        if (clientInGame(clientId)) {
            socket.send("error;You are already connected to a game");
            return;
        }
        if (!gameExists(args[1])) {
            socket.send("error;Game was not found");
            return;
        }
        if (gameIsFull(args[1])) {
            socket.send("error;Game is not available");
            return;
        }
        const linkStatus = linkClientToGame(args[1], clientId);
        if (linkStatus) {
            socket.send("game-joined;" + args[1]);
        } else {
            socket.send("error;Could not connect to game");
        }
        if (gameIsFull(args[1])) {
            startGame(args[1]);
            getClientsByGame(args[1]).forEach((clientId) => {
                const socket = getSocketByClient(clientId);
                socket.send("game-start");
            });
        }
    }
}

function handleGameMsg(socket, clientId, msg) {
    const args = msg.toString().split(";");
    if (!clientInGame(clientId)) {
        socket.send("error; Error: Game dosen't exist");
    }
    if (args[0] == "update") {
        sendGameUpdate(clientId, socket);
    }
    if (args[0] == "place") {
        const grid = Number(args[1]);
        const field = Number(args[2]);
        if (!isClientsTurn(clientId)) {
            socket.send("error;Not your turn");
            return;
        }
        if (grid < 0 || grid >= 9 || field < 0 || field >= 9) {
            socket.send("error;Error: Something went wrong (Array out of bounds)");
            return;
        }
        if (clientPlace(clientId, grid, field)) {
            const gameId = getGameByClient(clientId);
            updateAvailableGrids(gameId, field);
            updateGridResults(gameId);
            swapGameTurn(gameId);
            updateWinner(gameId);
            setTimeout(() => {
                getClientsByGame(gameId).forEach((clientId) => {
                    sendGameUpdate(clientId);
                });
            }, 15);
        } else {
            socket.send("error; Can not place there");
        }
    }
}

function sendGameUpdate(clientId, socket = null) {
    if (socket == null) {
        socket = getSocketByClient(clientId);
    }
    if (!clientInGame(clientId)) {
        return;
    }
    const gameId = getGameByClient(clientId);
    const gameJson = getGameJson(gameId, clientId);
    socket.send("update;" + JSON.stringify(gameJson));
}

module.exports = {
    handleClient,
};
