import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axiosConfig";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const register = async () => {
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      setError("Mobile number must be exactly 10 digits.");
      return;
    }

    try {
      setLoading(true);
      await API.post("/api/auth/register", {
        fullName,
        email,
        phone,
        password,
      });

      setSuccess("Registration successful. You can login now.");
      setFullName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-100 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 p-8 md:p-10">
        <h2 className="text-2xl font-bold text-slate-800 mb-1">Create Account</h2>
        <p className="text-slate-500 mb-6">Register as a new user.</p>

        {error && <p className="text-red-600 mb-3">{error}</p>}
        {success && <p className="text-green-600 mb-3">{success}</p>}

        <input
          className="border border-slate-200 rounded-lg p-3 w-full mb-3"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <input
          className="border border-slate-200 rounded-lg p-3 w-full mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border border-slate-200 rounded-lg p-3 w-full mb-3"
          placeholder="Mobile Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
        />

        <input
          type="password"
          className="border border-slate-200 rounded-lg p-3 w-full mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          className="border border-slate-200 rounded-lg p-3 w-full mb-4"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          onClick={register}
          disabled={
            loading ||
            !fullName ||
            !email ||
            !phone ||
            !password ||
            !confirmPassword
          }
          className="bg-blue-600 hover:bg-blue-700 text-white w-full p-3 rounded-lg font-semibold transition disabled:opacity-60"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-sm text-slate-600 mt-4">
          Already registered?{" "}
          <Link to="/login" className="text-blue-600 font-semibold">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
