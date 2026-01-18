import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
    return (
        <div className="nav">
        <div className="nav-inner">
            {/* Logo */}
            <Link className="brand" to="/">
            <span className="logo-bracket">[</span> Logo Photobox <span className="logo-bracket">]</span>
            </Link>

            {/* Menu */}
            <div className="nav-links">
            <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
                Home
            </NavLink>

            <NavLink to="/gallery" className={({ isActive }) => (isActive ? "active" : "")}>
                Gallery
            </NavLink>

            {/* Ini anchor ke section di Landing (nanti Landing perlu ada id="packages" dll) */}
            <a className="nav-anchor" href="/#packages">
                Packages
            </a>

            <NavLink to="/booking" className={({ isActive }) => (isActive ? "active" : "")}>
                Booking
            </NavLink>

            <a className="nav-anchor" href="/#contact">
                Contact
            </a>

            <Link className="btn nav-cta" to="/booking">
                Book Now
            </Link>
            </div>
        </div>
        </div>
    );
}
