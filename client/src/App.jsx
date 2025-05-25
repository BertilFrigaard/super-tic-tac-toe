import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import OfflineGamePage from "./pages/OfflineGamePage";
import OnlineGamePage from "./pages/OnlineGamePage";
import { SocketContext } from "./contexts/SocketContext";
import { useState } from "react";

const router = createBrowserRouter([
    { path: "/", element: <HomePage /> },
    { path: "/PlayOffline", element: <OfflineGamePage /> },
    { path: "/PlayOnline", element: <OnlineGamePage /> },
]);

function App() {
    const [socket, setSocket] = useState(null);

    return (
        <SocketContext.Provider value={[socket, setSocket]}>
            <RouterProvider router={router} />
        </SocketContext.Provider>
    );
}

export default App;
