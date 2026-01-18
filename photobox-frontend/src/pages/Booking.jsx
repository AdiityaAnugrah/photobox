import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Container from "../components/Container.jsx";
import Field from "../components/Field.jsx";
import Toast from "../components/Toast.jsx";
import { http } from "../api/http.js";
import { getApiErrorMessage } from "../api/error.js";
import { minutesBetween, nowPlusMinutes } from "../utils/dt.js";

function formatIDR(n) {
  try {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(n);
  } catch {
    return `Rp ${n}`;
  }
}

export default function Booking() {
  const [searchParams] = useSearchParams();
  const allowedPackages = useMemo(() => new Set(["Basic", "Standard", "Premium"]), []);

  const [toast, setToast] = useState({ type: "info", message: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    packageName: "Basic",
    paymentMethod: "cash", // cash | debit
    startAt: nowPlusMinutes(60),
    endAt: nowPlusMinutes(120),
    notes: "",
  });

  // ✅ FIX: useEffect harus di top-level (bukan di submit)
  useEffect(() => {
    const pkg = searchParams.get("package");
    if (pkg && allowedPackages.has(pkg)) {
      setForm((f) => ({ ...f, packageName: pkg }));
    }
  }, [searchParams, allowedPackages]);

  const durationMin = useMemo(
    () => minutesBetween(form.startAt, form.endAt),
    [form.startAt, form.endAt]
  );

  // Harga (contoh): base per paket + per 30 menit
  const priceConfig = useMemo(
    () => ({
      Basic: { base: 499_000, per30: 50_000 },
      Standard: { base: 899_000, per30: 75_000 },
      Premium: { base: 1_499_000, per30: 100_000 },
    }),
    []
  );

  const totalPrice = useMemo(() => {
    const cfg = priceConfig[form.packageName] || priceConfig.Basic;

    // minimal 1 blok 30 menit
    const blocks = Math.max(1, Math.ceil(Math.max(durationMin, 0) / 30));
    return cfg.base + (blocks - 1) * cfg.per30;
  }, [durationMin, form.packageName, priceConfig]);

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
        paymentMethod: form.paymentMethod, // ✅ tambah ini
        startAt: form.startAt,
        endAt: form.endAt,
        notes: form.notes || null,
        totalPrice, // ✅ kirim total (backend bisa verifikasi ulang)
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
          {/* KIRI */}
          <Field label="Nama">
            <input name="name" value={form.name} onChange={onChange} placeholder="Nama" required />
          </Field>

          {/* KANAN */}
          <Field label="No HP">
            <input name="phone" value={form.phone} onChange={onChange} placeholder="08xxxx" required />
          </Field>

          {/* KIRI */}
          <Field label="Email (opsional)">
            <input name="email" value={form.email} onChange={onChange} placeholder="email@..." />
          </Field>

          {/* KANAN */}
          <Field label="Paket">
            <select name="packageName" value={form.packageName} onChange={onChange}>
              <option value="Basic">Basic</option>
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
            </select>
          </Field>

          

          {/* KANAN - Start Time */}
          <Field label="Start Time">
            <input type="datetime-local" name="startAt" value={form.startAt} onChange={onChange} required />
          </Field>

          {/* KIRI - End Time */}
          <Field label="End Time" hint={`Durasi: ${durationMin} menit`}>
            <input type="datetime-local" name="endAt" value={form.endAt} onChange={onChange} required />
          </Field>

          {/* KIRI - Metode pembayaran */}
          <Field label="Metode Pembayaran">
            <select name="paymentMethod" value={form.paymentMethod} onChange={onChange}>
              <option value="cash">Cash</option>
              <option value="debit">Debit</option>
            </select>
          </Field>
          
          {/* KANAN - Total Harga (bawah start/end sesuai request) */}
          <Field
            label="Total Harga"
            hint={`Paket: ${form.packageName} • ${Math.max(1, Math.ceil(Math.max(durationMin, 0) / 30))} blok (30 menit)`}
          >
            <div className="total-box">
              <div className="total-amount">{formatIDR(totalPrice)}</div>
              <div className="muted" style={{ fontSize: 12 }}>
                Metode: <b>{form.paymentMethod === "cash" ? "Cash" : "Debit"}</b>
              </div>
            </div>
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
          <p className="muted">Simpan kode ini untuk memulai foto di menu Camera dan untuk akses Gallery.</p>
        </div>
      )}
    </Container>
  );
}
