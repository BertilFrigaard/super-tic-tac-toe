import { createContext, useContext, useState } from "react";
import Notifications from "../components/Notifications";

const NotificationContext = createContext();

export const UseNotification = () => {
    return useContext(NotificationContext);
};

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);

    const addNotification = (msg, timeout) => {
        const id = Date.now();
        setNotifications((prev) => [...prev, { id, msg }]);

        setTimeout(() => {
            setNotifications((prev) =>
                prev.filter((obj) => {
                    return obj.id != id;
                })
            );
        }, timeout);
    };
    return (
        <>
            <NotificationContext.Provider value={{ addNotification }}>
                {children}
                <Notifications notifications={notifications} />
            </NotificationContext.Provider>
        </>
    );
}
