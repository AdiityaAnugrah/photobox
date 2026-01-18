import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/Container.jsx";
import Field from "../components/Field.jsx";
import Toast from "../components/Toast.jsx";
import { http } from "../api/http.js";
import { getApiErrorMessage } from "../api/error.js";

export default function AdminLogin() {
    const nav = useNavigate();
    const [toast, setToast] = useState({ type: "info", message: "" });

    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        setToast({ type: "info", message: "" });
        setLoading(true);

        try {
        const { data } = await http.post("/api/auth/admin/login", form);
        localStorage.setItem("admin_token", data.token);
        nav("/admin");
        } catch (err) {
        setToast({ type: "error", message: getApiErrorMessage(err, "Login gagal.") });
        } finally {
        setLoading(false);
        }
    };

    return (
        <Container>
        <h1>Admin Login</h1>

        <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast({ type: "info", message: "" })}
        />

        <form className="card form" onSubmit={submit} style={{ maxWidth: 520 }}>
            <Field label="Email">
            <input name="email" value={form.email} onChange={onChange} placeholder="admin@..." required />
            </Field>

            <Field label="Password">
            <input
                name="password"
                type="password"
                value={form.password}
                onChange={onChange}
                placeholder="••••••••"
                required
            />
            </Field>

            <button className="btn" disabled={loading}>
            {loading ? "Loading..." : "Login"}
            </button>
        </form>
        </Container>
    );
}
