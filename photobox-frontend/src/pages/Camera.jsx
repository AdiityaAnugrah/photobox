import { useMemo, useState } from "react";
import Container from "../components/Container.jsx";
import Toast from "../components/Toast.jsx";

function CameraPermissionCard({ onAllow, onCancel }) {
    return (
        <div className="cam-card">
        <div className="cam-icon">📷</div>
        <div>
            <div className="cam-title">Akses Kamera Dibutuhkan</div>
            <div className="cam-sub">
            Untuk memulai sesi foto, izinkan akses kamera pada browser.
            </div>
        </div>

        <div className="cam-actions">
            <button className="btn" onClick={onAllow}>
            Allow Camera
            </button>
            <button className="btn ghost" onClick={onCancel}>
            Back
            </button>
        </div>
        </div>
    );
    }

    function useMockValidateCode() {
    // mock valid codes (nanti ganti API)
    const validSet = useMemo(() => new Set(["PBX-AB123", "PBX-TEST", "PBX-00001"]), []);
    return async (code) => {
        const c = (code || "").trim().toUpperCase();
        await new Promise((r) => setTimeout(r, 350)); // biar terasa loading
        if (!validSet.has(c)) {
        const err = new Error("Kode tidak valid. Cek struk/tiket kamu.");
        err.status = 404;
        throw err;
        }
        return {
        code: c,
        name: "Guest",
        package_name: "Standard",
        status: "confirmed",
        };
    };
    }

    export default function Camera() {
    const validateCode = useMockValidateCode();

    const [toast, setToast] = useState({ type: "info", message: "" });

    const [step, setStep] = useState("locked"); // locked | permission | live
    const [code, setCode] = useState("");
    const [booking, setBooking] = useState(null);

    const [checking, setChecking] = useState(false);
    const [starting, setStarting] = useState(false);

    const [stream, setStream] = useState(null);

    const stopStream = () => {
        if (stream) {
        stream.getTracks().forEach((t) => t.stop());
        }
        setStream(null);
    };

    const resetAll = () => {
        stopStream();
        setBooking(null);
        setStep("locked");
        setToast({ type: "info", message: "" });
    };

    const checkCode = async () => {
        setToast({ type: "info", message: "" });
        const c = code.trim();
        if (!c) {
        setToast({ type: "error", message: "Masukkan kode tiket dulu." });
        return;
        }

        setChecking(true);
        try {
        const b = await validateCode(c);
        setBooking(b);
        setStep("permission");
        setToast({ type: "success", message: "Kode valid. Lanjutkan untuk akses kamera." });
        } catch (err) {
        setToast({ type: "error", message: err?.message || "Gagal cek kode." });
        } finally {
        setChecking(false);
        }
    };

    const allowCamera = async () => {
        setToast({ type: "info", message: "" });
        setStarting(true);
        try {
        // NOTE: getUserMedia biasanya butuh HTTPS (atau localhost)
        const s = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" },
            audio: false,
        });
        setStream(s);
        setStep("live");
        setToast({ type: "success", message: "Kamera aktif. Siap foto!" });
        } catch (err) {
        setToast({
            type: "error",
            message:
            "Akses kamera ditolak / tidak tersedia. Pastikan kamu pakai HTTPS (atau localhost) dan izinkan kamera.",
        });
        } finally {
        setStarting(false);
        }
    };

    return (
        <Container>
        <div className="row space" style={{ alignItems: "flex-start" }}>
            <div>
            <h1>Camera</h1>
            <p className="muted" style={{ marginTop: 6 }}>
                Masukkan <b>kode tiket</b> dari struk setelah pembayaran untuk memulai sesi foto.
            </p>
            </div>
        </div>

        <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast({ type: "info", message: "" })}
        />

        {/* Step 1: LOCKED */}
        {step === "locked" && (
            <div className="cam-wrap">
            <div className="card">
                <h3 style={{ marginTop: 0 }}>Masukkan Kode Tiket</h3>
                <p className="muted">
                Kode ada di struk/tiket setelah pembayaran (online atau walk-in).
                </p>

                <div className="row" style={{ marginTop: 10 }}>
                <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="contoh: PBX-AB123"
                    style={{ textTransform: "uppercase" }}
                />
                <button className="btn" onClick={checkCode} disabled={checking}>
                    {checking ? "Checking..." : "Lanjut"}
                </button>
                </div>

                <div className="hr-top">
                <div className="muted" style={{ fontSize: 12 }}>
                    Belum punya kode? Silakan booking online atau bayar di kasir (walk-in).
                </div>
                </div>
            </div>
            </div>
        )}

        {/* Step 2: PERMISSION UI (mirip screenshot) */}
        {step === "permission" && booking && (
            <div className="cam-wrap">
            <div className="card" style={{ marginBottom: 12 }}>
                <div className="row space">
                <div>
                    <div className="muted" style={{ fontSize: 12 }}>
                    Ticket Code
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 800 }}>
                    <span className="pill">{booking.code}</span>
                    </div>
                </div>
                <button className="btn ghost small" onClick={resetAll}>
                    Ganti Code
                </button>
                </div>

                <div className="hr-top">
                <div className="muted">
                    Paket: <b>{booking.package_name}</b> • Status: <span className="pill">{booking.status}</span>
                </div>
                </div>
            </div>

            <CameraPermissionCard
                onAllow={allowCamera}
                onCancel={() => {
                stopStream();
                setStep("locked");
                }}
            />

            {starting && (
                <div className="card" style={{ marginTop: 12 }}>
                <p className="muted">Mengaktifkan kamera...</p>
                </div>
            )}
            </div>
        )}

        {/* Step 3: LIVE CAMERA */}
        {step === "live" && booking && (
            <div className="cam-wrap">
            <div className="card">
                <div className="row space">
                <div>
                    <div className="muted" style={{ fontSize: 12 }}>
                    Session
                    </div>
                    <div style={{ fontWeight: 800 }}>
                    <span className="pill">{booking.code}</span>
                    </div>
                </div>

                <div className="row">
                    <button
                    className="btn ghost small"
                    onClick={() => {
                        stopStream();
                        setStep("permission");
                    }}
                    >
                    Pause
                    </button>
                    <button className="btn small" onClick={resetAll}>
                    End Session
                    </button>
                </div>
                </div>

                <div className="hr-top">
                <div className="cam-preview">
                    <video
                    className="cam-video"
                    autoPlay
                    playsInline
                    ref={(el) => {
                        if (el && stream) el.srcObject = stream;
                    }}
                    />
                </div>

                <div className="cam-controls">
                    <button className="btn big" type="button" disabled>
                    ● Capture (next)
                    </button>
                    <div className="muted" style={{ fontSize: 12 }}>
                    (Nanti tombol Capture akan ambil foto + upload ke server.)
                    </div>
                </div>
                </div>
            </div>
            </div>
        )}
        </Container>
    );
}
