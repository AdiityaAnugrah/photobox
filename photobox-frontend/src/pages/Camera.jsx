import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Container from "../components/Container.jsx";
import Toast from "../components/Toast.jsx";

const TEMPLATES = [
    { id: "classic", name: "Classic", subtitle: "Clean & minimal" },
    { id: "birthday", name: "Birthday", subtitle: "Fun & cute" },
    { id: "wedding", name: "Wedding", subtitle: "Elegant" },
    { id: "retro", name: "Retro", subtitle: "Vintage vibe" },
];

const FILTERS = [
    { id: "normal", name: "Normal", css: "none" },
    { id: "bw", name: "B&W", css: "grayscale(1)" },
    { id: "sepia", name: "Sepia", css: "sepia(1)" },
    { id: "vintage", name: "Vintage", css: "sepia(0.35) contrast(1.1) saturate(0.9)" },
    { id: "cool", name: "Cool", css: "contrast(1.05) saturate(0.9) hue-rotate(190deg)" },
    { id: "warm", name: "Warm", css: "contrast(1.05) saturate(1.05) hue-rotate(-10deg)" },
    { id: "dramatic", name: "Dramatic", css: "contrast(1.25) saturate(1.15)" },
];

export default function Camera() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    
    const [sp] = useSearchParams();
    
    const [toast, setToast] = useState({ type: "info", message: "" });
    
    const [code, setCode] = useState("");
    const [stage, setStage] = useState("LOCKED"); // LOCKED | TEMPLATE | LIVE | REVIEW
    const [loading, setLoading] = useState(false);
    
    const [templateId, setTemplateId] = useState(null);
    const selectedTemplate = useMemo(
        () => TEMPLATES.find((t) => t.id === templateId),
        [templateId]
    );
    
    const [capturedDataUrl, setCapturedDataUrl] = useState(null);
    const [filterId, setFilterId] = useState("normal");
    const selectedFilter = useMemo(
        () => FILTERS.find((f) => f.id === filterId) || FILTERS[0],
        [filterId]
    );
    
    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }
        
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };
    
    const startCamera = async () => {
        try {
            // NOTE: getUserMedia butuh HTTPS kecuali localhost
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" },
                audio: false,
            });
            
            streamRef.current = stream;
            
            // attach kalau video sudah ada
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }
            return true;
    } catch (err) {
        setToast({
            type: "error",
            message: "Tidak bisa mengakses kamera. Pastikan izin kamera aktif (HTTPS/localhost).",
        });
        return false;
    }
};
// cleanup saat keluar page
    useEffect(() => {
        return () => stopCamera();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  // auto isi code dari /camera?code=...
    useEffect(() => {
        const q = sp.get("code");
        if (q && q.trim()) {
            setCode(q.trim().toUpperCase());
            setStage("TEMPLATE");
        }
    }, [sp]);
// START camera otomatis ketika masuk stage LIVE (lebih stabil, video sudah render)
    useEffect(() => {
    let cancelled = false;    
        const run = async () => {
            if (stage !== "LIVE") return;
            
            const ok = await startCamera();
            if (!ok && !cancelled) {
                setStage("TEMPLATE");
            }
        };
        run();
        
        return () => {
            cancelled = true;
        // kalau keluar dari LIVE/REVIEW atau unmount, stop stream
            if (stage !== "LIVE") return;
        // jangan stop di sini kalau kamu mau tetap hidup saat LIVE (opsional)
        // tapi aman untuk stop kalau pindah stage
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stage]);
    
    // ==== Step 1: submit code ====
    const submitCode = (e) => {
        e.preventDefault();
        setToast({ type: "info", message: "" });
        
        const v = code.trim();
        if (!v) {
            setToast({ type: "error", message: "Masukkan ticket code." });
            return;
        }
        
        setLoading(true);
        
        // Dummy validation (nanti ganti API)
        setTimeout(() => {
            const valid = v.length >= 6;
            setLoading(false);
            
            if (!valid) {
                setToast({ type: "error", message: "Ticket code tidak valid." });
                return;
            }
            
            setStage("TEMPLATE");
            setToast({ type: "success", message: "Kode valid. Pilih template dulu." });
        }, 400);
    };
    
    // ==== Step 2: choose template then go live ====
    const proceedToLive = () => {
        if (!templateId) {
            setToast({ type: "error", message: "Pilih template/frame dulu." });
            return;
        }
        setToast({ type: "info", message: "" });
        
        // render video dulu, startCamera dijalankan oleh useEffect(stage)
        setStage("LIVE");
    };
    
    // ==== Capture ====
    const capture = () => {
        setToast({ type: "info", message: "" });
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) 
            return;
        
        const w = video.videoWidth || 1280;
        const h = video.videoHeight || 720;
        
        canvas.width = w;
        canvas.height = h;
        
        const ctx = canvas.getContext("2d");
        if (!ctx) 
            return;
        
        // mirror selfie
        ctx.save();
        ctx.translate(w, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, w, h);
        ctx.restore();
        
        const url = canvas.toDataURL("image/jpeg", 0.92);
        setCapturedDataUrl(url);
        setFilterId("normal");
        setStage("REVIEW");
        
        // hemat resource: stop kamera setelah capture
        stopCamera();
    };
    
    const resetAll = () => {
        stopCamera();
        setCode("");
        setTemplateId(null);
        setCapturedDataUrl(null);
        setFilterId("normal");
        setStage("LOCKED");
        setToast({ type: "info", message: "" });
    };
    
    const retake = async () => {
        setCapturedDataUrl(null);
        setFilterId("normal");
        setStage("LIVE"); // useEffect akan startCamera lagi
        };
        
        return (
            <Container>
                <Toast
                type={toast.type}
                message={toast.message}
                onClose={() => setToast({ type: "info", message: "" })}
                />
                
                {/* Hidden canvas for capture */}
                <canvas ref={canvasRef} style={{ display: "none" }} />
                
                {/* ================= LOCKED: INPUT CODE ================= */}
                {stage === "LOCKED" && (
                    <div className="cam-wrap">
                        <div className="cam-card">
                            <div className="cam-icon">🔒</div>
                            <div>
                                <div className="cam-title">Masukkan Ticket Code</div>
                                <div className="cam-sub">Kode dari struk setelah booking & pembayaran.</div>
                            </div>
                            <form className="cam-actions" onSubmit={submitCode}>
                                <input
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                placeholder="Contoh: PBX-8F2A"
                                style={{ maxWidth: 240 }}
                                />
                                
                                <button className="btn" disabled={loading}>
                                    {loading ? "Cek..." : "Lanjut"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
                
                {/* ================= TEMPLATE: PICK FRAME ================= */}
                {stage === "TEMPLATE" && (
                    <div className="cam-wrap">
                        <div className="row space" style={{ marginBottom: 12 }}>
                            <div>
                                <h1 style={{ margin: 0 }}>Pilih Template / Frame</h1>
                                <div className="muted" style={{ marginTop: 6 }}>
                                    Ticket: <span className="pill">{code.trim().toUpperCase()}</span>
                                </div>
                            </div>
                            
                            <button className="btn ghost small" onClick={resetAll} type="button">Ganti Code</button>
                        </div>
                        
                        <div className="lp-works-grid" style={{ marginTop: 0 }}>
                            {TEMPLATES.map((t) => {
                                const active = t.id === templateId;
                                return (
                                    <button key={t.id} type="button" className={`tpl-card ${active ? "active" : ""}`} onClick={() => setTemplateId(t.id)}>
                                        <div className="tpl-preview">
                                            <div className="tpl-badge">Frame</div>
                                        </div>
                                        <div className="tpl-meta">
                                            <div className="tpl-name">{t.name}</div>
                                            <div className="muted" style={{ fontSize: 12 }}>{t.subtitle}</div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                        
                        <div className="card" style={{ marginTop: 12 }}>
                            <div className="row space">
                                <div className="muted">Terpilih: <b>{selectedTemplate ? selectedTemplate.name : "—"}</b></div>
                                <button className="btn" onClick={proceedToLive} type="button">Lanjut ke Camera</button>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* ================= LIVE: CAMERA READY ================= */}
                {stage === "LIVE" && (
                    <div className="cam-wrap">
                        <div className="card" style={{ marginBottom: 12 }}>
                            <div className="row space">
                                <div>
                                    <div className="muted" style={{ fontSize: 12 }}>Ticket • Template</div>
                                    <div style={{ fontWeight: 900 }}>
                                        <span className="pill">{code.trim().toUpperCase()}</span>{" "}
                                        <span className="pill">{selectedTemplate?.name || "—"}</span>
                                    </div>
                                </div>
                                
                                <div className="row">
                                    <button className="btn ghost small" type="button" onClick={() => { stopCamera(); setStage("TEMPLATE"); }} >Ganti Template</button>
                                    <button className="btn ghost small" type="button" onClick={resetAll}>Keluar</button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="cam-preview">
                            <video ref={videoRef} className="cam-video cam-mirror" playsInline muted />
                            <div className="frame-overlay">
                                <div className="frame-top">{selectedTemplate?.name || ""}</div>
                                <div className="frame-bottom">{code.trim().toUpperCase()}</div>
                            </div>
                        </div>
                        
                        <div className="cam-controls">
                            <button className="btn big" onClick={capture} type="button">📸 Capture</button>
                            <div className="muted" style={{ fontSize: 12 }}>Setelah capture, kamu bisa pilih filter hasilnya.</div>
                        </div>
                    </div>
                )}
                
                {/* ================= REVIEW: FILTERS ================= */}
                {stage === "REVIEW" && (
                    <div className="cam-wrap">
                        <div className="card" style={{ marginBottom: 12 }}>
                            <div className="row space">
                                <div>
                                    <div className="muted" style={{ fontSize: 12 }}>Result • Template • Ticket</div>
                                    <div style={{ fontWeight: 900 }}>
                                        <span className="pill">{selectedTemplate?.name || "—"}</span>{" "}
                                        <span className="pill">{code.trim().toUpperCase()}</span>
                                    </div>
                                </div>
                                
                                <div className="row">
                                    <button className="btn ghost small" type="button" onClick={retake}>Retake</button>
                                    <button className="btn ghost small" type="button" onClick={() => setStage("TEMPLATE")}>Ganti Template</button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="cam-preview">
                            {capturedDataUrl ? (
                                <img src={
                                    capturedDataUrl
                                }
                                alt="Captured"
                                className="cam-video"
                                style={{ filter: selectedFilter.css }} />
                            ) : (
                            <div className="card">No image</div>
                            )}
                            
                            <div className="frame-overlay">
                                <div className="frame-top">{selectedTemplate?.name || ""}</div>
                                <div className="frame-bottom">{code.trim().toUpperCase()}</div>
                            </div>
                        </div>
                        
                        <div className="card" style={{ marginTop: 12 }}>
                            <div className="muted" style={{ marginBottom: 10 }}>Pilih filter:</div>
                            
                            <div className="filters-row">
                                {FILTERS.map((f) => {
                                    const active = f.id === filterId;
                                    return (
                                        <button
                                            key={f.id}
                                            type="button"
                                            className={`filter-chip ${active ? "active" : ""}`}
                                            onClick={() => setFilterId(f.id)}>
                                            {f.name}
                                        </button>
                                    );
                                })}
                            </div>
                            
                            <div className="hr-top">
                                <div className="row space">
                                    <div className="muted">Filter: <b>{selectedFilter.name}</b></div>
                                    
                                    <button
                                        className="btn"
                                        type="button"
                                        onClick={() =>
                                            setToast({
                                                type: "success",
                                                message: "Siap! Nanti tombol ini bisa dipakai untuk Save/Upload ke Gallery.",
                                            })
                                        } >Save / Upload (next)
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Container>
        );
    }
