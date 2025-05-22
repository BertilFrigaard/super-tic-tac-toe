const {
    createClient,
    createGame,
    clientInGame,
    linkClientToGame,
    gameExists,
    deleteClient
} = require("./game");

function handleClient(socket) {

    const clientId = createClient(socket);

    socket.on("message", (msg) => {

        console.log("Recieved: " + msg.toString());
        
        const args = msg.toString().split(";");

        if (args[0] == "create-game") {
            if (clientInGame(clientId)) {
                socket.send("create-game;error;You are already connected to a game");
                return;
            }
            const joinCode = createGame();
            const linkStatus = linkClientToGame(joinCode, clientId);
            if (!linkStatus) {
                socket.send("create-game;error;Could not connect to game");
                return;
            }
            socket.send("create-game;success;" + joinCode);
        }

        else if (args[0] == "join-game") {
            if (clientInGame(clientId)) {
                socket.send("join-game;error;You are already connected to a game");
                return;
            }
            if (!gameExists(args[1])) {
                socket.send("join-game;error;Game was not found");
                return;
            }
            
        }

    });

    socket.on("close", () => {

        deleteClient();

    });
}

module.exports = {
    handleClient
}