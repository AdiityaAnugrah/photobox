export default function Toast({ type = "info", message, onClose }) {
    if (!message) return null;
    return (
        <div className={`toast ${type}`}>
        <div className="toast-msg">{message}</div>
        <button className="btn small ghost" onClick={onClose}>
            ✕
        </button>
        </div>
    );
}
