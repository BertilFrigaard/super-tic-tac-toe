import { useEffect, useState } from "react";
import "./HomePage.css";
import Popup from "../components/Popup";

const GAMESTATE = {
    IDLE: 0,
    LOADING: 1,
    AWAITING_OPPONENT: 2,
    ENTER_JOIN_CODE: 3,
}

function HomePage() {
    const [gameState, setGameState] = useState(GAMESTATE.IDLE);
    const [socket, setSocket] = useState(null);
    const [gameId, setGameId] = useState(null);

    const notify = (msg) => {
        console.log("Dialog: " + msg);
    }

    const onJoinGameClick = () => {
        if (socket != null) {
            notify("ERROR: Socket already open (socket != null)");
            return;
        }
        setGameState(GAMESTATE.ENTER_JOIN_CODE);
    }

    const onCreateGameClick = () => {
        if (socket != null) {
            notify("ERROR: Socket already open (socket != null)");
            return;
        }
        setGameState(GAMESTATE.LOADING);
        setSocket(new WebSocket("http://localhost:3001/createGame"));
    }

    const ifIdle = (func, fallback) => {
        if (gameState == GAMESTATE.IDLE) {
            func();
        } else if(fallback != null) {
            fallback();
        }
    }

    useEffect(() => {
        if (socket) {
            socket.onopen = () => {
                socket.send("create-game");
            }

            socket.onmessage = (msg) => {
                console.log("Recieved: " + msg.data);

                const args = msg.data.split(";");
                if (args[0] == "create-game") {
                    if (gameState != GAMESTATE.LOADING) {
                        notify("ERROR: Wrong gamestate for game creation (gameState != LOADING)");
                        return;
                    }
                    if (args[1] != "success") {
                        notify("ERROR: Something went wrong, try again (!success)");
                        return;
                    }
                    setGameState(GAMESTATE.AWAITING_OPPONENT);
                    setGameId(args[2]);
                }
            }           
        }
    }, [socket]);

    return (
        <>
            <main>
                <div className="section title-section">
                    <h1>Super Tic-Tac-Toe</h1>
                </div>
                <div className="section online-section">
                    <h2>Play Online</h2>
                    <button onClick={() => {ifIdle(onCreateGameClick)}}>Create Game</button>
                    <button onClick={() => {ifIdle(onJoinGameClick)}}>Join Game</button>
                </div>
                <div className="section offline-section">
                    <h2>Play Offline</h2>
                    <button onClick={() => {ifIdle(() => {location.href="/PlayOffline"})}}>Start Game</button>
                </div>
                {gameState == GAMESTATE.AWAITING_OPPONENT &&
                    <Popup title="Waiting for opponent" html={
                        <>
                            <p>The following code can be used to connect this game</p>
                            <h3>{gameId}</h3>
                            <button onClick={() => {notify("ERROR: Not implemented (Cancel AWAITING_OPPONENT)")}}>Cancel</button>
                        </>
                    } />
                }

                {gameState == GAMESTATE.ENTER_JOIN_CODE && 
                    <Popup title="Enter Join Code" html={
                        <>
                            <p>Enter the game code</p>
                            <input placeholder="######"></input>
                            <button onClick={() => {setGameState(GAMESTATE.IDLE)}}>Join</button>
                            <button onClick={() => {setGameState(GAMESTATE.IDLE)}}>Cancel</button>
                        </>
                    } />
                }
            </main>
            <footer>
                <p>	© 2025 Bertil Frigaard </p>
                {/* <p>Hej, mit navn er William jeg har lavet denne ting fordi jeg er så klog at jeg kan programmere :)</p> */}
            </footer>
        </>
    )
}

export default HomePage;