import { useState } from "react";
import API from "../api/axios";
import bg from "../assets/bg.jpg";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div
      className="h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* 💎 Bigger Centered Login Card */}
      <div className="backdrop-blur-md bg-white/90 border border-white shadow-[0_20px_60px_rgba(0,0,0,0.25)] rounded-3xl p-12 w-[450px] text-gray-800 transition-all duration-300">

        <h1 className="text-4xl font-bold text-center text-[#0f2a44] mb-2">
          PrepTrack
        </h1>

        <p className="text-center text-[#274c77] mb-8 text-sm">
          Learn smarter, grow faster 🚀
        </p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            className="w-full mb-5 p-4 rounded-xl bg-white border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative w-full mb-6">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    className="w-full p-4 pr-12 rounded-xl border border-blue-200 text-[#0f2a44] focus:ring-2 focus:ring-blue-400 outline-none transition"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />

  {/* 👁️ Toggle Icon */}
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0f2a44] opacity-70 hover:opacity-100"
  >
    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
  </button>
</div>


          <button className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-[#0f2a44] to-[#0f2a42] hover:scale-[1.03] transition">
            Login
          </button>
          <p className="text-center text-sm mt-6 text-[#274c77]">
  Don’t have an account?{" "}
  <Link
    to="/register"
    className="font-semibold text-[#0f2a44] hover:underline"
  >
    Create one
  </Link>
</p>
        </form>
      </div>
    </div>
  );
}
