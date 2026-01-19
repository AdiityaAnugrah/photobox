import { Link, useSearchParams } from "react-router-dom";
import Container from "../components/Container.jsx";

function genCode() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const part = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    return `PBX-${part()}-${part()}`;
}

export default function Ticket() {
    const [sp] = useSearchParams();
    const code = sp.get("code") || genCode();
    
    return (
        <Container>
            <div className="ticket-page">
                <h1>Ticket / Struk Photobox</h1>
                <p className="muted">Ini contoh tampilan ticket setelah booking & pembayaran. Kode ini dipakai untuk membuka Camera & Gallery.</p>
                
                <div className="ticket">
                    <div className="ticket-top">
                        <div className="ticket-brand">
                            <div className="ticket-logo">📸</div>
                            
                            <div>
                                <div className="ticket-title">Photobox CoffeeShop</div>
                                <div className="muted" style={{ fontSize: 12 }}>Payment success • Keep this code</div>
                            </div>
                        </div>
                        
                        <div className="ticket-meta">
                            <div><span className="muted">Package</span><br /><b>Standard</b></div>
                            <div><span className="muted">Duration</span><br /><b>60 min</b></div>
                            <div><span className="muted">Method</span><br /><b>Debit</b></div>
                        </div>
                    </div>
                    
                    <div className="ticket-divider" />
                        <div className="ticket-code-wrap">
                            <div className="muted" style={{ fontSize: 12, marginBottom: 6 }}>TICKET CODE</div>
                            <div className="ticket-code">{code}</div>
                            <div className="muted" style={{ fontSize: 12, marginTop: 8 }}>Masukkan code ini di Camera. Untuk demo, kamu bisa langsung klik tombol di bawah.</div>
                        </div>
                        
                        <div className="ticket-actions">
                            <Link className="btn" to={`/camera?code=${encodeURIComponent(code)}`}>Open Camera</Link>
                            <Link className="btn ghost" to={`/gallery?code=${encodeURIComponent(code)}`}>Open Gallery</Link>
                        </div>
                        
                        <div className="ticket-foot muted">Simpan ticket ini sampai sesi selesai. • © Photobox Prototype</div>
                </div>
                
                <div className="row" style={{ marginTop: 12 }}>
                    <Link className="btn ghost" to={`/ticket?code=${encodeURIComponent(genCode())}`}>Generate Ticket Baru</Link>
                    <Link className="btn ghost" to="/booking">Kembali ke Booking</Link>
                </div>
            </div>
        </Container>
    );
}
