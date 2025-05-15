import { useState } from "react";
import "./HomePage.css";

const GAMESTATE = {
    IDLE: 0,
    LOADING: 1,
}

function HomePage() {
    const [gameState, setGameState] = useState(GAMESTATE.IDLE);

    const notify = (msg) => {
        console.log("Dialog: " + msg);
    }

    const onCreateGameClick = () => {
        console.log("click");
        setGameState(GAMESTATE.LOADING);
        fetch("http://localhost:3001/createGame", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },

        }).then((res) => {
            if (res.status != 201) {
                notify("ERROR: Request failed (Response " + res.status + ")");
                return;
            }
            return res.json();

        }).then((data) => {
            console.log(data);

        }).catch((e) => {
            notify("ERROR: An error has occured (Fetch error)");

        });
    }

    return (
        <>
            <main>
                <div className="section title-section">
                    <h1>Super Tic-Tac-Toe</h1>
                </div>
                <div className="section online-section">
                    <h2>Play Online</h2>
                    <button onClick={onCreateGameClick}>Create Game</button>
                    <button>Join Game</button>
                </div>
                <div className="section offline-section">
                    <h2>Play Offline</h2>
                    <button onClick={() => {location.href="/PlayOffline"}}>Start Game</button>
                </div>
            </main>
            <footer>
                <p>	© 2025 Bertil Frigaard </p>
                {/* <p>Hej, mit navn er William jeg har lavet denne ting fordi jeg er så klog at jeg kan programmere :)</p> */}
            </footer>
        </>
    )
}

export default HomePage;