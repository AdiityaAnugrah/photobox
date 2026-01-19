import { useState } from "react";
import Container from "../components/Container.jsx";
import Field from "../components/Field.jsx";
import Toast from "../components/Toast.jsx";
import { API_BASE, http } from "../api/http.js";
import { getApiErrorMessage } from "../api/error.js";

export default function Gallery() {
    const [toast, setToast] = useState({ type: "info", message: "" });
    
    const [code, setCode] = useState("");
    const [booking, setBooking] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const load = async () => {
        setToast({ type: "info", message: "" });
        setBooking(null);
        setPhotos([]);
        
        const c = code.trim();
        if (!c) {
        setToast({ type: "error", message: "Masukkan booking code untuk lihat gallery." });
        return;
        }
        
        setLoading(true);
        try {
            const { data } = await http.get(`/api/gallery/${encodeURIComponent(c)}`);
            setBooking(data.booking);
            setPhotos(data.photos || []);
            setToast({ type: "success", message: "Gallery berhasil dimuat." });
            } catch (err) {
                setToast({ type: "error", message: getApiErrorMessage(err, "Gagal memuat gallery.") });
            } finally {
                setLoading(false);
        }
    };
    
    const imgUrl = (filePath) => {
        if (!filePath) return "";
        const clean = filePath.startsWith("/") ? filePath : `/${filePath}`;
        return `${API_BASE}${clean}`;
    };
    
    return (
        <Container>
            <h1>Gallery</h1>
            <p className="muted">Privat: hanya bisa diakses dengan booking code.</p>
            <Toast
                type={toast.type}
                message={toast.message}
                onClose={() => setToast({ type: "info", message: "" })}
            />
            
            <div className="card">
                <Field label="Booking Code">
                    <div className="row">
                        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="PBX-XXXXX" />
                        <button className="btn" onClick={load} disabled={loading}>
                        {loading ? "Loading..." : "Load Gallery"}
                        </button>
                    </div>
                </Field>
                
                {booking && (
                    <div className="hr-top">
                        <p>Booking: <span className="pill">{booking.code}</span> — Status:{" "}<span className="pill">{booking.status}</span></p>
                    </div>
                )}
            </div>
            
            {photos.length > 0 && (
                <div className="grid">
                    {photos.map((p) => (
                        <div key={p.id} className="photo">
                            <img src={imgUrl(p.file_path)} alt={`photo-${p.id}`} />
                            
                            <div className="photo-meta">
                                <span className="muted">{new Date(p.taken_at).toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            {booking && photos.length === 0 && (
                <div className="card" style={{ marginTop: 16 }}>
                    <p className="muted">Belum ada foto untuk booking ini.</p>
                </div>
            )}
        </Container>
    );
}
