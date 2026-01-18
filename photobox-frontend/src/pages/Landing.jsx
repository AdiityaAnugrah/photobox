import { Link } from "react-router-dom";
import Container from "../components/Container.jsx";

export default function Landing() {
    return (
        <Container>
        <div className="hero">
            <div>
            <h1>Sistem Photobox</h1>
            <p className="muted">
                Booking fleksibel (custom durasi), photobox pakai booking code, dan gallery privat.
            </p>
            <div className="row">
                <Link className="btn" to="/booking">
                Booking Sekarang
                </Link>
                <Link className="btn ghost" to="/gallery">
                Buka Gallery (pakai code)
                </Link>
            </div>
            <div className="cards">
                <div className="card">
                <h3>Custom Durasi</h3>
                <p className="muted">Tentukan sendiri start & end time sesuai kebutuhan.</p>
                </div>
                <div className="card">
                <h3>Photobox Mode</h3>
                <p className="muted">Masukkan booking code, upload hasil foto sesi.</p>
                </div>
                <div className="card">
                <h3>Gallery Privat</h3>
                <p className="muted">Foto hanya bisa dilihat jika punya booking code.</p>
                </div>
            </div>
            </div>
            <div className="hero-box">
            <div className="badge">v1</div>
            <div className="hero-preview">
                <div className="preview-line" />
                <div className="preview-line" />
                <div className="preview-line short" />
                <div className="preview-grid">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="preview-photo" />
                ))}
                </div>
            </div>
            </div>
        </div>
        </Container>
    );
}
