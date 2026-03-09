import { useState } from "react";
import API from "../api/axiosConfig";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.post("/api/auth/login", { username, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username || username);
      if (res.data.userId) {
        localStorage.setItem("userId", String(res.data.userId));
      }

      window.location = "/dashboard";
    } catch {
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-100 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
        <section className="text-slate-800">
          <p className="inline-block text-xs font-semibold tracking-[0.2em] uppercase bg-white/70 rounded-full px-3 py-1 shadow-sm">
            RealEstate CRM
          </p>
          <h1 className="mt-5 text-4xl md:text-5xl font-black leading-tight">
            Close More Deals With
            <span className="block text-blue-700">One Unified CRM</span>
          </h1>
          <p className="mt-4 text-slate-600 text-lg max-w-md">
            Manage properties, agents, and customer follow-ups from one place.
            Built for daily speed and visibility.
          </p>
        </section>

        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-8 md:p-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-1">Welcome back</h2>
          <p className="text-slate-500 mb-6">Sign in to continue.</p>

          {error && <p className="text-red-600 mb-3">{error}</p>}

          <input
            className="border border-slate-200 focus:border-blue-500 focus:outline-none p-3 w-full mb-3 rounded-lg"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            className="border border-slate-200 focus:border-blue-500 focus:outline-none p-3 w-full mb-4 rounded-lg"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={login}
            disabled={loading || !username || !password}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full p-3 rounded-lg font-semibold transition disabled:opacity-60 disabled:hover:bg-blue-600"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
