import { useState } from "react";
import Container from "../components/Container.jsx";
import Field from "../components/Field.jsx";
import Toast from "../components/Toast.jsx";
import { API_BASE, http } from "../api/http.js";
import { getApiErrorMessage } from "../api/error.js";

export default function Photobox() {
    const [toast, setToast] = useState({ type: "info", message: "" });
    
    const [code, setCode] = useState("");
    const [booking, setBooking] = useState(null);
    
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploaded, setUploaded] = useState(null);
    
    const check = async () => {
        setToast({ type: "info", message: "" });
        setBooking(null);
        setUploaded(null);
        
        const c = code.trim();
        if (!c) {
            setToast({ type: "error", message: "Masukkan booking code." });
        }
        
        try {
            const { data } = await http.get(`/api/bookings/${encodeURIComponent(c)}`);
            setBooking(data.booking);
            setToast({ type: "success", message: "Booking ditemukan. Sesi bisa dimulai." });
        } catch (err) {
            setToast({ type: "error", message: getApiErrorMessage(err, "Booking code tidak valid.") });
        }
    };
    
    const upload = async () => {
        const c = code.trim();
        if (!file) {
            setToast({ type: "error", message: "Pilih file foto dulu." });
            return;
        }
        
        setUploading(true);
        setToast({ type: "info", message: "" });
        
        try {
            const fd = new FormData();
            fd.append("bookingCode", c);
            fd.append("photo", file);
            
            const { data } = await http.post("/api/photobox/upload", fd, {
                headers: { "Content-Type": "multipart/form-data" 
                },
            });
            
            setUploaded(data.photo);
            setToast({ type: "success", message: "Foto berhasil diupload." });
        } catch (err) {
            setToast({ type: "error", message: getApiErrorMessage(err, "Gagal upload foto.") });
        } finally {
            setUploading(false);
        }
    };
    
    const renderImg = (filePath) => {
        if (!filePath) return null;
        const clean = filePath.startsWith("/") ? filePath : `/${filePath}`;
        return `${API_BASE}${clean}`;
    };
    
    return (
        <Container>
            <h1>Photobox System</h1>
            <p className="muted">Masukkan booking code, lalu upload hasil foto sesi.</p>
            
            <Toast type={
                toast.type
            }
            message={
                toast.message
            }
            onClose={() => setToast({ type: "info", message: "" })}
            />
            
            <div className="card">
                <Field label="Booking Code">
                    <div className="row">
                        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="PBX-XXXXX" />
                        <button className="btn" onClick={check}>Check</button>
                    </div>
                </Field>
                
                {booking && (
                    <div className="hr-top">
                        <p>Atas nama: <b>{booking.name}</b> — Paket: <b>{booking.package_name}</b></p>
                        <p className="muted">Status: <span className="pill">{booking.status}</span></p>
                        
                        <Field label="Upload Foto">
                            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                        </Field>
                        
                        <button className="btn" onClick={upload} disabled={uploading || !file}>
                            {uploading ? "Uploading..." : "Upload"}
                        </button>
                        
                        {uploaded?.file_path && (
                            <div className="hr-top">
                                <p className="muted">Preview:</p>
                                <img className="preview-img" src={renderImg(uploaded.file_path)} alt="uploaded" />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Container>
    );
}
