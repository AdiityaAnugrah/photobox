import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
    const nav = useNavigate();
    const token = localStorage.getItem("admin_token");
    const logout = () => {
        localStorage.removeItem("admin_token");
        nav("/admin/login");
    };

    return (
        <div className="nav">
        <div className="nav-inner">
            <Link className="brand" to="/">
            Photobox
            </Link>
            <div className="nav-links">
            <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
                Home
            </NavLink>
            <NavLink to="/booking" className={({ isActive }) => (isActive ? "active" : "")}>
                Booking
            </NavLink>
            <NavLink to="/photobox" className={({ isActive }) => (isActive ? "active" : "")}>
                Photobox
            </NavLink>
            <NavLink to="/gallery" className={({ isActive }) => (isActive ? "active" : "")}>
                Gallery
            </NavLink>
            <span className="sep" />
            {!token ? (
                <NavLink to="/admin/login" className={({ isActive }) => (isActive ? "active" : "")}>
                Admin
                </NavLink>
            ) : (
                <>
                <NavLink to="/admin" className={({ isActive }) => (isActive ? "active" : "")}>
                    Dashboard
                </NavLink>
                <button className="btn small" onClick={logout}>
                    Logout
                </button>
                </>
            )}
            </div>
        </div>
        </div>
    );
}
