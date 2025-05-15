import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import OfflineGamePage from "./pages/OfflineGamePage";

const router = createBrowserRouter([
    { path: "/", element: <HomePage/> },
    { path: "/PlayOffline", element: <OfflineGamePage/> },

])

function App() {
    return (
        <RouterProvider router={router}/>
    )
}

export default App;