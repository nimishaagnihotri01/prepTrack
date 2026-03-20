import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import bg from "../assets/bg.jpg";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ✅ NEW STATES
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      await API.post("/api/auth/register", {
  name,
  email,
  password,
});

      // ✅ SUCCESS MESSAGE
      setMessage(
        "📧 Registration successful! Please verify your email before logging in."
      );

      // 🔁 Redirect after 2 sec
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="flex bg-white/90 shadow-[0_20px_60px_rgba(0,0,0,0.25)] rounded-3xl overflow-hidden w-[800px]">

        {/* 🔵 LEFT PANEL */}
        <div className="w-1/2 bg-gradient-to-br from-[#0f2a44] to-[#1f4e79] text-white flex flex-col justify-center items-center p-10">
          <h2 className="text-4xl font-bold mb-3">PrepTrack</h2>
          <p className="text-sm opacity-90 text-center leading-relaxed">
            Start your learning journey 🚀 <br />
            Track progress, stay focused, and grow faster.
          </p>
        </div>

        {/* 💎 RIGHT PANEL */}
        <div className="w-1/2 p-12 text-gray-800">
          <h1 className="text-3xl font-bold text-[#0f2a44] mb-8">
            Create Account
          </h1>

          {/* ✅ SUCCESS MESSAGE */}
          {message && (
            <p className="mb-4 text-green-700 bg-green-100 p-3 rounded-lg text-sm">
              {message}
            </p>
          )}

          {/* ❌ ERROR MESSAGE */}
          {error && (
            <p className="mb-4 text-red-700 bg-red-100 p-3 rounded-lg text-sm">
              {error}
            </p>
          )}

          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Name"
              className="w-full mb-4 p-4 rounded-xl border border-blue-200 text-[#0f2a44] focus:ring-2 focus:ring-blue-400 outline-none transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full mb-4 p-4 rounded-xl border border-blue-200 text-[#0f2a44] focus:ring-2 focus:ring-blue-400 outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* 🔒 PASSWORD FIELD */}
            <div className="relative w-full mb-6">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full p-4 pr-12 rounded-xl border border-blue-200 text-[#0f2a44] focus:ring-2 focus:ring-blue-400 outline-none transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0f2a44] opacity-70 hover:opacity-100"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* 🔥 BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#0f2a44] to-[#1f4e79] hover:scale-[1.03] hover:shadow-[0_10px_25px_rgba(15,42,68,0.4)]"
              }`}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          {/* 🔁 LOGIN LINK */}
          <p className="text-center text-sm mt-6 text-[#274c77]">
            Already have an account?{" "}
            <Link
              to="/"
              className="font-semibold text-[#0f2a44] hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}