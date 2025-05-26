import "./Notifications.css";

function Notifications({ notifications }) {
    return (
        <div className="notification-container">
            {notifications.map((v) => (
                <p key={v.id} className="notification">
                    {v.msg}
                </p>
            ))}
        </div>
    );
}

export default Notifications;
