const { v4: uuidv4 } = require('uuid');

const clients = new Map(); // clientID ; socket connection
const games = new Map(); // gameID (Join Code) ; game object (Game class)
const players = new Map(); // clientID ; gameID

class Game {
    constructor() {
        this.p1 = null;
        this.p2 = null;
    }
}

function createGame() {
    let joinCode = generateJoinCode();
    while (games.has(joinCode)) {
        joinCode = generateJoinCode();
    }

    const game = new Game();
    games.set(joinCode, game);
    return joinCode;
}

function gameExists(gameId) {
    return games.has(gameId);
}

function linkClientToGame(gameId, clientId) {
    const game = games.get(gameId);
    if (game) 
    {
        if (game.p1 == null) 
        {
            game.p1 = clientId;
            return true;
        } 
        else if (game.p2 == null) 
        {
            game.p2 = clientId;
            return true
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

function clientInGame(clientId, gameId=null) {
    if (gameId == null) {
        return players.has(clientId);
    } else {
        return players.get(clientId) == gameId;
    }
}

function generateJoinCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomString = '';
    for (let i = 0; i < 6; i++) {
        randomString += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomString;
}

module.exports = {
    createClient,
    deleteClient,
    clientInGame,
    createGame,
    linkClientToGame,
    gameExists
}