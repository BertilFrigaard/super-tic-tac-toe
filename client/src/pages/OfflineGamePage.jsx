import "./OfflineGamePage.css";

import { useState } from "react";
import SuperGrid from "../components/SuperGrid";

const GAMESTATE = {
    PLAYING: 0,
    OVER: 1,
};

function OfflineGamePage() {
    const [grids, setGrids] = useState(Array(9).fill(Array(9).fill(null)));
    const [gridResults, setGridResults] = useState(Array(9).fill(null));
    const [availableGrids, setAvailableGrids] = useState([
        0, 1, 2, 3, 4, 5, 6, 7, 8,
    ]);
    const [turn, setTurn] = useState("X");
    const [gameState, setGameState] = useState(GAMESTATE.PLAYING);

    const notify = (msg) => {
        console.log("Dialog: " + msg);
    };

    const handleClick = (grid, field) => {
        if (gameState !== GAMESTATE.PLAYING) {
            notify("Game is over. Reload the page to play again!");
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

        let newGrids = grids.map((row) => [...row]);
        newGrids[grid][field] = turn;
        setGrids(() => {
            const winner = calculateWinner(newGrids[grid]);
            let newGridResults = gridResults.map((x) => x);

            if (winner) {
                newGridResults[grid] = winner;
            }

            setGridResults(newGridResults);

            const superWinner = calculateWinner(newGridResults);
            if (superWinner !== null) {
                setTurn(superWinner);
                setGameState(GAMESTATE.OVER);
                setAvailableGrids([]);
            } else {
                setTurn(turn === "X" ? "O" : "X");
                if (newGridResults[field] != null) {
                    setAvailableGrids(
                        newGridResults.map((v, i) => (v == null ? i : null))
                    );
                } else {
                    setAvailableGrids([field]);
                }
            }

            return newGrids;
        });
    };

    return (
        <div className="page-root">
            <h1>Super Tic-Tac-Toe</h1>
            {gameState === GAMESTATE.PLAYING && (
                <h3>It's player {turn}'s turn</h3>
            )}
            {gameState === GAMESTATE.OVER && <h3>Player {turn} has won!</h3>}
            <SuperGrid
                grids={grids}
                availableGrids={availableGrids}
                gridResults={gridResults}
                onClick={handleClick}
            />
        </div>
    );
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

export default OfflineGamePage;
