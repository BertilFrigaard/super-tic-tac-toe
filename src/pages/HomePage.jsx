import "./HomePage.css";

function HomePage() {
    return (
        <>
            <main>
                <div className="section title-section">
                    <h1>Super Tic-Tac-Toe</h1>
                </div>
                <div className="section online-section">
                    <h2>Play Online</h2>
                    <button>Create Game</button>
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