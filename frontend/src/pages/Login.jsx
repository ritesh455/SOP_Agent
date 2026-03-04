import { useState } from "react";
import { login } from "../services/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    try {
      const res = await login(username, password);
      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("role", res.role);
        window.location.href = "/";
      } else {
        setError(res.message || "Login failed");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">OpsMind AI</h2>
          <p className="text-slate-500 mt-2">Sign in to your SOP Assistant</p>
        </div>
        <div className="space-y-4">
          <input
            placeholder="Username / Employee ID"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
          <button onClick={handleLogin} className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-95">
            Login
          </button>
          {error && <p className="text-red-500 text-center text-sm font-medium">{error}</p>}
        </div>
      </div>
    </div>
  );
}