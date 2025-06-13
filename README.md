# Super Tic-Tac-Toe
This is an extended version of the popular game Tic-Tac-Toe.
Instead of one board with 9 squares, this game has one big board, with nine small boards.
This contributes to a new and more strategic version of the game.

*By Bertil Frigaard*

## Watch demo
You can view a demo of the project at
https://youtu.be/bQm5dfyZySk 

## Try it yourself
Or you can try it out yourself at
https://tic-tac-toe.bertilfrigaard.dk

## Technical
This web app runs on a ` node.js ` backend with `express`. This backend serves up a react app at “/”. The react app uses `react-router-dom` to navigate between pages. This way I navigate between the homepage, the offline game page and the online game page. 

In the offline game mode, you play the entire game on your own machine. This also means the react page component can keep track of the game in its entirety. I then split up the boards and fields into reusable components and used prop-drilling to pass data to the children of the page component. To register field clicks I prop-drill a callback function from the page component and all the way down to the lowest level. This can be avoided by using react-context. However, I decided to go with prop-drilling as I wouldn’t need to drill too far down, which is what the react docs themselves are against. 

In the online game mode, you play the game against another web browser. I have therefore chosen to extract the game logic into the `node.js` server. This way the client (The `React` app) only acts as an interface to interact with the game through Api’s. When a client requests the creation of a game, it is done by sending a message through a WebSocket. The server needs to always keep track of all WebSocket connections. This way the server knows who is sending a message, and who it should respond to. When requesting the creation of a new game, the server responds with a 6 digit “Join-Code”. In another browser the opponent can then enter the “Join-Code” to join the game. Once someone has joined the game, it is full, and the server sends a message to both clients informing them that the game is starting. Once the game has started the client listens to updates from the server. The update contains information about whose turn it is and how the board looks at the time of the update. This way the client can display the current board to the player, and allow the player to make moves, only when it is their turn. Of course, someone could still try to cheat, which is why I validate whose turn it is before acting on it. Once a player has made a valid move on the board, the server sends at update to both clients, informing them of the new board and whom can make the next move. 

## Credits
Thanks to whoever came up with the idea, because it certainly wasn't me :)

