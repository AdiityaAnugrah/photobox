import { useMemo, useState } from "react";
import Container from "../components/Container.jsx";
import Field from "../components/Field.jsx";
import Toast from "../components/Toast.jsx";
import { http } from "../api/http.js";
import { getApiErrorMessage } from "../api/error.js";
import { minutesBetween, nowPlusMinutes } from "../utils/dt.js";

export default function Booking() {
    const [toast, setToast] = useState({ type: "info", message: "" });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        packageName: "Basic",
        startAt: nowPlusMinutes(60),
        endAt: nowPlusMinutes(120),
        notes: "",
    });

    const durationMin = useMemo(
        () => minutesBetween(form.startAt, form.endAt),
        [form.startAt, form.endAt]
    );

    const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        setResult(null);
        setToast({ type: "info", message: "" });

        if (durationMin <= 0) {
        setToast({ type: "error", message: "End time harus setelah start time." });
        return;
        }
        if (durationMin < 10) {
        setToast({ type: "error", message: "Durasi minimal 10 menit." });
        return;
        }

        setLoading(true);
        try {
        const { data } = await http.post("/api/bookings", {
            name: form.name,
            phone: form.phone,
            email: form.email || null,
            packageName: form.packageName,
            startAt: form.startAt,
            endAt: form.endAt,
            notes: form.notes || null,
        });

        setResult(data.booking);
        setToast({ type: "success", message: "Booking berhasil dibuat." });
        } catch (err) {
        const status = err?.response?.status;
        if (status === 409) {
            setToast({ type: "error", message: "Slot bentrok. Pilih waktu lain." });
        } else {
            setToast({ type: "error", message: getApiErrorMessage(err, "Gagal membuat booking.") });
        }
        } finally {
        setLoading(false);
        }
    };

    return (
        <Container>
        <h1>Booking</h1>
        <p className="muted">Pilih waktu Start dan End (custom durasi).</p>

        <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast({ type: "info", message: "" })}
        />

        <form className="card form" onSubmit={submit}>
            <div className="grid2">
            <Field label="Nama">
                <input name="name" value={form.name} onChange={onChange} placeholder="Nama" required />
            </Field>

            <Field label="No HP">
                <input name="phone" value={form.phone} onChange={onChange} placeholder="08xxxx" required />
            </Field>

            <Field label="Email (opsional)">
                <input name="email" value={form.email} onChange={onChange} placeholder="email@..." />
            </Field>

            <Field label="Paket">
                <select name="packageName" value={form.packageName} onChange={onChange}>
                <option value="Basic">Basic</option>
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
                </select>
            </Field>

            <Field label="Start Time">
                <input type="datetime-local" name="startAt" value={form.startAt} onChange={onChange} required />
            </Field>

            <Field label="End Time" hint={`Durasi: ${durationMin} menit`}>
                <input type="datetime-local" name="endAt" value={form.endAt} onChange={onChange} required />
            </Field>
            </div>

            <Field label="Catatan (opsional)">
            <textarea
                name="notes"
                value={form.notes}
                onChange={onChange}
                placeholder="Catatan tambahan..."
                rows={3}
            />
            </Field>

            <div className="row">
            <button className="btn" disabled={loading}>
                {loading ? "Memproses..." : "Submit Booking"}
            </button>
            </div>
        </form>

        {result && (
            <div className="card" style={{ marginTop: 16 }}>
            <h3>Booking Berhasil ✅</h3>
            <p>
                Kode Booking: <span className="pill">{result.code}</span>
            </p>
            <p className="muted">Simpan kode ini untuk Photobox dan Gallery.</p>
            </div>
        )}
        </Container>
    );
}
