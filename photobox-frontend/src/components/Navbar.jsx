import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="nav">
      <div className="nav-inner">
        <Link className="brand" to="/">
          <span className="logo-bracket">[</span> AntaraKita <span className="logo-bracket">]</span>
        </Link>
        
        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            Home
          </NavLink>
          
          <NavLink to="/gallery" className={({ isActive }) => (isActive ? "active" : "")}>
            Gallery
          </NavLink>
          
          <NavLink to="/packages" className={({ isActive }) => (isActive ? "active" : "")}>
            Packages
          </NavLink>
          
          <NavLink to="/booking" className={({ isActive }) => (isActive ? "active" : "")}>
            Booking
          </NavLink>
          
          <NavLink to="/contact" className={({ isActive }) => (isActive ? "active" : "")}>
            Contact
          </NavLink>
          
          {/* CTA utama */}
          <NavLink
            to="/camera"
            className={({ isActive }) => (isActive ? "btn nav-cta active-cta" : "btn nav-cta")}>
              Camera
          </NavLink>
        </div>
      </div>
    </div>
  );
}
