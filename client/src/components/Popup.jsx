import "./Popup.css";

function Popup({ title, html }) {
    return (
        <div className="popup-container">
            <h1>{title}</h1>
            {html}
        </div>
    )
}

export default Popup;