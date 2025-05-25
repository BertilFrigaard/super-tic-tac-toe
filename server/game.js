const { v4: uuidv4 } = require("uuid");

const clients = new Map(); // clientID ; socket connection
const games = new Map(); // gameID (Join Code) ; game object (Game class)
const players = new Map(); // clientID ; gameID

const GAMESTATE = {
    PLAYING: 0,
    OVER: 1,
};

class Game {
    constructor() {
        this.p1 = null;
        this.p2 = null;
        this.active = false;
        this.turn = null;
        this.grids = Array.from({ length: 9 }, () => Array(9).fill(null));
        this.gridResults = Array(9).fill(null);
        this.availableGrids = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        this.gameState = GAMESTATE.PLAYING;
    }
}
// ONGOING GAME  ONGOING GAME  ONGOING GAME

function isClientsTurn(clientId) {
    const game = games.get(getGameByClient(clientId));
    if (!game.active) {
        return false;
    }
    return game.turn == clientId;
}

function clientPlace(clientId, grid, field) {
    const game = games.get(getGameByClient(clientId));
    if (game.gameState != GAMESTATE.PLAYING) {
        return false;
    }
    if (game.gridResults[grid] != null) {
        return false;
    }
    if (!game.availableGrids.includes(grid)) {
        return false;
    }
    if (game.grids[grid][field] != null) {
        return false;
    }
    game.grids[grid][field] = clientId;
    return true;
}

function updateAvailableGrids(gameId, field) {
    const game = games.get(gameId);
    if (game.gridResults[field] == null) {
        game.availableGrids = [field];
    } else {
        game.availableGrids = game.gridResults.map((v, i) =>
            v == null ? i : null
        );
    }
}

function updateGridResults(gameId) {
    const game = games.get(gameId);
    for (let grid = 0; grid < 9; grid++) {
        if (game.gridResults[grid] != null) {
            continue;
        }
        const winner = calculateWinner(game.grids[grid]);
        if (winner != null) {
            game.gridResults[grid] = winner;
        }
    }
}

function updateWinner(gameId) {
    const game = games.get(gameId);
    const winner = calculateWinner(game.gridResults);
    console.log("winner: ", winner);
    if (winner != null) {
        game.turn = winner;
        game.gameState = GAMESTATE.OVER;
    }
}

function swapGameTurn(gameId) {
    const game = games.get(gameId);
    if (game.turn == game.p1) {
        game.turn = game.p2;
    } else if (game.turn == game.p2) {
        game.turn = game.p1;
    } else {
        game.turn = null;
    }
}

function getField(gameId, grid, field) {
    const game = games.get(gameId);
    return game.grids[grid][field];
}

function calculateWinner(fields) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            return fields[a];
        }
    }
    return null;
}

// ONGOING GAME  ONGOING GAME  ONGOING GAME

function createGame() {
    let joinCode = generateJoinCode();
    while (games.has(joinCode)) {
        joinCode = generateJoinCode();
    }

    const game = new Game();
    games.set(joinCode, game);
    return joinCode;
}

function startGame(gameId) {
    if (!gameExists(gameId)) {
        return false;
    }
    const game = games.get(gameId);
    game.active = true;
    if (Math.random() * 2 >= 1) {
        game.turn = game.p1;
    } else {
        game.turn = game.p2;
    }
    return true;
}

function gameIsActive(gameId) {
    if (!gameExists(gameId)) {
        return false;
    }

    const game = games.get(gameId);
    return game.active;
}

function gameIsFull(gameId) {
    if (!gameExists(gameId)) {
        return false;
    }
    const game = games.get(gameId);
    return game.p1 != null && game.p2 != null;
}

function gameExists(gameId) {
    return games.has(gameId);
}

function linkClientToGame(gameId, clientId) {
    const game = games.get(gameId);
    if (game) {
        if (game.p1 == null) {
            game.p1 = clientId;
            players.set(clientId, gameId);
            return true;
        } else if (game.p2 == null) {
            game.p2 = clientId;
            players.set(clientId, gameId);
            return true;
        }
    }
    return false;
}

function createClient(socket) {
    const clientId = uuidv4();
    clients.set(clientId, socket);
    return clientId;
}

function deleteClient(clientId) {
    clients.delete(clientId);
}

function clientInGame(clientId, gameId = null) {
    if (gameId == null) {
        return players.has(clientId);
    } else {
        return players.get(clientId) == gameId;
    }
}

function getGameByClient(clientId) {
    if (!clientInGame(clientId)) {
        return null;
    }
    return players.get(clientId);
}

function getClientsByGame(gameId) {
    let clientList = [];
    if (gameExists(gameId)) {
        const game = games.get(gameId);
        if (game.p1) {
            clientList.push(game.p1);
        }
        if (game.p2) {
            clientList.push(game.p2);
        }
    }
    return clientList;
}

function getSocketByClient(clientId) {
    if (clients.has(clientId)) {
        return clients.get(clientId);
    }
    return null;
}

function getGameJson(gameId, clientId) {
    const game = games.get(gameId);

    const clientGrids = [];
    for (let i = 0; i < 9; i++) {
        clientGrids[i] = [];
        for (let k = 0; k < 9; k++) {
            const field = getField(gameId, i, k);
            if (field == clientId) {
                clientGrids[i][k] = true;
            } else if (field != null) {
                clientGrids[i][k] = false;
            } else {
                clientGrids[i][k] = null;
            }
        }
    }

    const clientGridResults = [];
    for (let i = 0; i < 9; i++) {
        if (game.gridResults[i] == clientId) {
            clientGridResults[i] = true;
        } else if (game.gridResults[i] != null) {
            clientGridResults[i] = false;
        } else {
            clientGridResults[i] = null;
        }
    }
    return {
        grids: clientGrids,
        gridResults: clientGridResults,
        availableGrids: game.turn == clientId ? game.availableGrids : [],
        turn: isClientsTurn(clientId),
        gameState: game.gameState,
    };
}

function generateJoinCode() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomString = "";
    for (let i = 0; i < 6; i++) {
        randomString += characters.charAt(
            Math.floor(Math.random() * characters.length)
        );
    }
    return randomString;
}

module.exports = {
    createClient,
    deleteClient,
    clientInGame,
    createGame,
    linkClientToGame,
    gameExists,
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
};
