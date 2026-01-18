import { Link } from "react-router-dom";
import Container from "../components/Container.jsx";

export default function Contact() {
    return (
        <Container>
            <div className="row space">
                <div>
                    <h1>Contact</h1>
                    <p className="muted">Ganti data kontak sesuai bisnis kamu.</p>
                </div>
                <Link className="btn" to="/booking">Book Now</Link>
            </div>
            
            <div className="cards" style={{ marginTop: 12 }}>
                <div className="card">
                    <h3>WhatsApp</h3>
                        <p className="muted">+62 8xx-xxxx-xxxx</p>
                        <p className="muted" style={{ fontSize: 12 }}>(Ganti dengan nomor kamu)</p>
                </div>
                
                <div className="card">
                    <h3>Instagram</h3>
                        <p className="muted">@photobox.id</p>
                        <p className="muted" style={{ fontSize: 12 }}>(Ganti dengan IG kamu)</p>
                </div>
                
                <div className="card">
                    <h3>Alamat / Jam</h3>
                        <p className="muted">Jakarta • 10:00–22:00</p>
                        <p className="muted" style={{ fontSize: 12 }}>(Opsional)</p>
                </div>
            </div>
            
            <div className="card" style={{ marginTop: 12 }}>
                <h3>Form kontak (opsional)</h3>
                    <p className="muted">
                        Kalau nanti mau, form ini bisa dihubungkan ke backend (kirim email/WA).
                    </p>
                <div className="grid2" style={{ marginTop: 10 }}>
                    <input placeholder="Nama" />
                    <input placeholder="No HP / Email" />
                </div>
                <textarea style={{ marginTop: 10 }} rows={4} placeholder="Pesan..." />
                <div className="row" style={{ marginTop: 10 }}>
                    <button className="btn" type="button">Kirim</button>
                </div>
            </div>
        </Container>
    );
}
