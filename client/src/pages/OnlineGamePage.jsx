import "./OnlineGamePage.css";

import { useContext, useEffect, useState } from "react";
import SuperGrid from "../components/SuperGrid";
import { SocketContext } from "../contexts/SocketContext";
import { useNavigate } from "react-router";

const GAMESTATE = {
    PLAYING: 0,
    OVER: 1,
    INTERRUPTED: 2,
};

function OnlineGamePage() {
    const [socket, setSocket] = useContext(SocketContext);
    const [grids, setGrids] = useState(Array(9).fill(Array(9).fill(null)));
    const [gridResults, setGridResults] = useState(Array(9).fill(null));
    const [availableGrids, setAvailableGrids] = useState([
        0, 1, 2, 3, 4, 5, 6, 7, 8,
    ]);
    const [turn, setTurn] = useState(false);
    const [gameState, setGameState] = useState(GAMESTATE.PLAYING);

    const navigate = useNavigate();

    useEffect(() => {
        if (!socket) {
            navigate("/");
            return;
        }
        socket.onmessage = (msg) => {
            console.log("Recieved: " + msg.data);
            const args = msg.data.split(";");
            if (args[0] == "update") {
                const jsonMsg = JSON.parse(args[1]);
                setGrids(jsonMsg.grids);
                setGridResults(jsonMsg.gridResults);
                setAvailableGrids(jsonMsg.availableGrids);
                setTurn(jsonMsg.turn);
                setGameState(jsonMsg.gameState);
            } else if (args[0] == "error") {
                notify(args[1]);
                socket.send("update");
            }
        };
        socket.send("update");
        socket.onclose = () => {
            setGameState(GAMESTATE.INTERRUPTED);
            setTurn(false);
            notify("The game was interrupted and is now over");
        };
    }, [socket]);

    const notify = (msg) => {
        console.log("Dialog: " + msg);
    };

    const handleClick = (grid, field) => {
        if (gameState !== GAMESTATE.PLAYING) {
            notify("Game is over. Reload the page to play again!");
            return;
        }

        if (!turn) {
            notify("It is not your turn!");
            return;
        }

        if (
            grid < 0 ||
            grid >= grids.length ||
            field < 0 ||
            field >= grids[0].length
        ) {
            notify("ERROR: Something went wrong (Array out of bounds)");
            return;
        }

        if (!availableGrids.includes(grid)) {
            notify(
                "This grid is not available, place in a available grid instead!"
            );
            return;
        }

        if (grids[grid][field]) {
            notify("This field is occupied!");
            return;
        }

        socket.send("place;" + grid + ";" + field);
        setTurn(false);
    };

    return (
        <div className="page-root">
            <h1>Super Tic-Tac-Toe</h1>
            {gameState === GAMESTATE.PLAYING && (
                <h3>It's {turn ? "your" : "your opponent's"} turn</h3>
            )}
            {gameState === GAMESTATE.OVER && (
                <h3>{turn ? "You have" : "Your opponent has"} won!</h3>
            )}
            {gameState === GAMESTATE.INTERRUPTED && (
                <h3 className="error-txt">The game was interrupted</h3>
            )}
            <div className="backdrop">
                <SuperGrid
                    grids={getFilledGrids(grids, "X", "O")}
                    availableGrids={
                        turn && gameState == GAMESTATE.PLAYING
                            ? availableGrids
                            : []
                    }
                    gridResults={getFilledGridResults(gridResults, "X", "O")}
                    onClick={handleClick}
                />
            </div>
        </div>
    );
}

function getFilledGrids(grids, truePlayer, falsePlayer) {
    const outGrids = [];
    for (let i = 0; i < 9; i++) {
        outGrids[i] = [];
        for (let k = 0; k < 9; k++) {
            if (grids[i][k] == true) {
                outGrids[i][k] = truePlayer;
            } else if (grids[i][k] == false) {
                outGrids[i][k] = falsePlayer;
            } else {
                outGrids[i][k] = null;
            }
        }
    }
    return outGrids;
}

function getFilledGridResults(gridResults, truePlayer, falsePlayer) {
    const outGridResults = [];
    for (let i = 0; i < 9; i++) {
        if (gridResults[i] == true) {
            outGridResults[i] = truePlayer;
        } else if (gridResults[i] == false) {
            outGridResults[i] = falsePlayer;
        } else {
            outGridResults[i] = null;
        }
    }
    return outGridResults;
}

export default OnlineGamePage;
