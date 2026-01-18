import { useEffect, useState } from "react";
import Container from "../components/Container.jsx";
import Toast from "../components/Toast.jsx";
import { http } from "../api/http.js";
import { getApiErrorMessage } from "../api/error.js";

export default function AdminDashboard() {
    const [toast, setToast] = useState({ type: "info", message: "" });

    const [stats, setStats] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        setToast({ type: "info", message: "" });
        try {
        const [s, b] = await Promise.all([http.get("/api/admin/stats"), http.get("/api/admin/bookings")]);
        setStats(s.data);
        setBookings(b.data.bookings || []);
        } catch (err) {
        setToast({
            type: "error",
            message: getApiErrorMessage(err, "Gagal load dashboard. Pastikan endpoint admin + token valid."),
        });
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setStatus = async (id, status) => {
        setToast({ type: "info", message: "" });
        try {
        await http.patch(`/api/admin/bookings/${id}`, { status });
        setToast({ type: "success", message: "Status berhasil diupdate." });
        await load();
        } catch (err) {
        setToast({ type: "error", message: getApiErrorMessage(err, "Gagal update status.") });
        }
    };

    return (
        <Container>
        <div className="row space">
            <h1>Admin Dashboard</h1>
            <button className="btn ghost" onClick={load} disabled={loading}>
            Refresh
            </button>
        </div>

        <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast({ type: "info", message: "" })}
        />

        {stats && (
            <div className="cards" style={{ marginTop: 12 }}>
            <div className="card">
                <div className="kpi">{stats.totalBookings ?? "-"}</div>
                <div className="muted">Total bookings</div>
            </div>
            <div className="card">
                <div className="kpi">{stats.pending ?? "-"}</div>
                <div className="muted">Pending</div>
            </div>
            <div className="card">
                <div className="kpi">{stats.confirmed ?? "-"}</div>
                <div className="muted">Confirmed</div>
            </div>
            <div className="card">
                <div className="kpi">{stats.done ?? "-"}</div>
                <div className="muted">Done</div>
            </div>
            </div>
        )}

        <div className="card" style={{ marginTop: 16 }}>
            <h3>Bookings</h3>

            {loading ? (
            <p className="muted">Loading...</p>
            ) : bookings.length === 0 ? (
            <p className="muted">Belum ada booking.</p>
            ) : (
            <div className="table-wrap">
                <table>
                <thead>
                    <tr>
                    <th>ID</th>
                    <th>Code</th>
                    <th>Nama</th>
                    <th>Paket</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Status</th>
                    <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((b) => (
                    <tr key={b.id}>
                        <td>{b.id}</td>
                        <td>
                        <span className="pill">{b.code}</span>
                        </td>
                        <td>{b.name}</td>
                        <td>{b.package_name}</td>
                        <td>{new Date(b.start_at).toLocaleString()}</td>
                        <td>{new Date(b.end_at).toLocaleString()}</td>
                        <td>{b.status}</td>
                        <td>
                        <div className="row">
                            <button className="btn small" onClick={() => setStatus(b.id, "confirmed")}>
                            Confirm
                            </button>
                            <button className="btn small ghost" onClick={() => setStatus(b.id, "cancelled")}>
                            Cancel
                            </button>
                            <button className="btn small ghost" onClick={() => setStatus(b.id, "done")}>
                            Done
                            </button>
                        </div>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            )}
        </div>
        </Container>
    );
}
