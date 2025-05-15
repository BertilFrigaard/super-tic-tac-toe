import "./Field.css";

function Field({ value, onClick }) {
    return (
        <button className="grid-button" onClick={onClick}>{value}</button>
    )
}

export default Field;