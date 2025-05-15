import "./Field.css";

function Field({ value, onClick }) {
    return (
        <button onClick={onClick}>{value}</button>
    )
}

export default Field;