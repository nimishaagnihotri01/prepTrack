import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import bg from "../assets/bg.jpg";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      console.log("LOGIN SUCCESS:", res.data);

      localStorage.setItem("token", res.data.token);

      window.location.href = "/dashboard";
    } catch (err) {
      console.log("LOGIN ERROR:", err);

      setError(
        err.response?.data?.message || "Login failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="backdrop-blur-md bg-white/90 border shadow-lg rounded-3xl p-12 w-[450px]">

        <h1 className="text-3xl font-bold text-center mb-6">
          PrepTrack
        </h1>

        {/* ERROR MESSAGE */}
        {error && (
          <p className="mb-4 text-red-700 bg-red-100 p-3 rounded">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 p-3 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 border rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white ${
              loading
                ? "bg-gray-400"
                : "bg-[#0f2a44]"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600">
            Create one
          </Link>
        </p>

      </div>
    </div>
  );
}