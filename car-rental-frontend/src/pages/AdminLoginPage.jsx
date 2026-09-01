import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api/api";

export default function AdminLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("adminLoggedIn", "true");
localStorage.setItem("adminToken", data.token);

navigate("/admin");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-5 py-20">
      <div className="rounded-2xl bg-mist-card p-8 ring-1 ring-mist-dim">
        <h1 className="font-display text-3xl text-ink">
          Admin Login
        </h1>

        <p className="mt-2 text-sm text-steel">
          Hyr për të menaxhuar makinat dhe rezervimet.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm text-steel">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-mist-dim px-3 py-2 text-ink outline-none focus:border-highway"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-steel">
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-mist-dim px-3 py-2 text-ink outline-none focus:border-highway"
            />
          </label>

          {error && (
            <p className="text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-amber px-5 py-3 text-sm font-bold text-ink transition hover:bg-amber-dark disabled:opacity-50"
          >
            {loading ? "Duke hyrë..." : "Hyr"}
          </button>
        </form>
      </div>
    </div>
  );
}