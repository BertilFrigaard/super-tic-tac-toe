import { useContext, useEffect, useState } from "react";
import "./HomePage.css";
import Popup from "../components/Popup";
import { GAMESTATE, SOCKET_URL } from "../constants/GAMESTATE";
import { SocketContext } from "../contexts/SocketContext";
import { useNavigate } from "react-router";
import { UseNotification } from "../contexts/NotificationContext";

function HomePage() {
    const [socket, setSocket] = useContext(SocketContext);
    const { addNotification } = UseNotification();

    const [gameState, setGameState] = useState(GAMESTATE.IDLE);
    const [joinCode, setJoinCode] = useState("");
    const [gameId, setGameId] = useState(null);

    const navigate = useNavigate();

    const notify = (msg) => {
        addNotification(msg, 4000);
    };

    const onShowJoinPopupClick = () => {
        if (socket != null) {
            notify("ERROR: Socket already open (socket != null)");
            return;
        }
        setGameState(GAMESTATE.ENTER_JOIN_CODE);
    };

    const onCreateGameClick = () => {
        if (socket != null) {
            notify("ERROR: Socket already open (socket != null)");
            return;
        }
        setGameState(GAMESTATE.CREATING_GAME);
    };

    const onJoinGameClick = () => {
        if (socket != null) {
            notify("ERROR: Socket already open (socket != null)");
            return;
        }
        setGameState(GAMESTATE.JOINING_GAME);
    };

    const ifIdle = (func, fallback) => {
        if (gameState == GAMESTATE.IDLE) {
            func();
        } else if (fallback != null) {
            fallback();
        }
    };

    const isValidJoinCode = (joinCode) => {
        if (joinCode.length != 6) {
            return false;
        }
        return true;
    };

    useEffect(() => {
        if (gameState == GAMESTATE.CREATING_GAME) {
            setSocket(new WebSocket(SOCKET_URL));
        } else if (gameState == GAMESTATE.JOINING_GAME) {
            setSocket(new WebSocket(SOCKET_URL));
        } else if (gameState == GAMESTATE.CANCELING) {
            if (socket) {
                socket.close();
                setSocket(null);
            } else {
                setGameState(GAMESTATE.IDLE);
            }
        }
    }, [gameState]);

    useEffect(() => {
        if (socket) {
            if (gameState == GAMESTATE.CREATING_GAME) {
                socket.onopen = () => {
                    setGameState(GAMESTATE.LOADING);
                    socket.send("create-game");
                };
            } else if (gameState == GAMESTATE.JOINING_GAME) {
                socket.onopen = () => {
                    if (!isValidJoinCode(joinCode)) {
                        notify("ERROR: Invalid join code");
                        setGameState(GAMESTATE.CANCELING);
                        return;
                    }
                    setGameState(GAMESTATE.LOADING);
                    socket.send("join-game;" + joinCode);
                };
            }

            socket.onclose = () => {
                navigate("/");
            };

            socket.onmessage = (msg) => {
                const args = msg.data.split(";");
                if (args[0] == "game-joined") {
                    setGameState(GAMESTATE.AWAITING_OPPONENT);
                    setGameId(args[1]);
                } else if (args[0] == "game-start") {
                    navigate("/PlayOnline");
                } else if (args[0] == "error") {
                    notify(args[1]);
                    setGameState(GAMESTATE.CANCELING);
                }
            };
        } else {
            setGameState(GAMESTATE.IDLE);
        }
    }, [socket]);

    return (
        <>
            <main>
                <h1 className="title">Super Tic-Tac-Toe</h1>
                <h2 className="sub-title">Nine Boards - One Winner</h2>
                <div className="section online-section">
                    <h3>Play Online</h3>
                    <p>Challenge players worldwide or invite a friend.</p>
                    <button
                        onClick={() => {
                            ifIdle(onCreateGameClick);
                        }}
                    >
                        Create Game
                    </button>
                    <button
                        onClick={() => {
                            ifIdle(onShowJoinPopupClick);
                        }}
                    >
                        Join Game
                    </button>
                </div>
                <div className="section offline-section">
                    <h3>Play Offline</h3>
                    <p>Enjoy a game locally or practice your skills.</p>
                    <button
                        onClick={() => {
                            ifIdle(() => {
                                navigate("/PlayOffline");
                            });
                        }}
                    >
                        Start Game
                    </button>
                </div>
                {gameState == GAMESTATE.AWAITING_OPPONENT && (
                    <Popup
                        title="Waiting for opponent"
                        html={
                            <>
                                <p>The following code can be used to connect this game</p>
                                <h3>{gameId}</h3>
                                <button
                                    onClick={() => {
                                        setGameState(GAMESTATE.CANCELING);
                                    }}
                                >
                                    Cancel
                                </button>
                            </>
                        }
                    />
                )}

                {gameState == GAMESTATE.ENTER_JOIN_CODE && (
                    <Popup
                        title="Enter Join Code"
                        html={
                            <>
                                <p>Enter the game code</p>
                                <input
                                    placeholder="######"
                                    value={joinCode}
                                    onChange={(event) => {
                                        setJoinCode(event.target.value);
                                    }}
                                    onSubmit={onJoinGameClick}
                                    autoFocus
                                ></input>
                                <button onClick={onJoinGameClick}>Join</button>
                                <button
                                    onClick={() => {
                                        setGameState(GAMESTATE.CANCELING);
                                    }}
                                >
                                    Cancel
                                </button>
                            </>
                        }
                    />
                )}
            </main>
            <footer>
                <p> © 2025 Bertil Frigaard </p>
                {/* <p>Hej, mit navn er William jeg har lavet denne ting fordi jeg er så klog at jeg kan programmere :)</p> */}
            </footer>
        </>
    );
}

export default HomePage;
