import { useState } from "react";
import { Link } from "react-router-dom";
import bg from "../assets/bg.jpg";
import { Eye, EyeOff } from "lucide-react";
import API from "../api/axios";
export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);


const handleRegister = async (e) => {
  e.preventDefault();

  try {
    const res = await API.post("/api/auth/register", {
      name,
      email,
      password,
    });

    alert(res.data.message);

    // 🔥 OPEN VERIFY LINK
    if (res.data.verifyURL) {
      window.open(res.data.verifyURL, "_blank");
    }

  } catch (err) {
    alert(err.response?.data?.message || "Register failed");
  }
};

  return (
    <div
      className="h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="flex bg-white/90 shadow-xl rounded-3xl overflow-hidden w-[800px]">

        {/* LEFT */}
        <div className="w-1/2 bg-gradient-to-br from-[#0f2a44] to-[#1f4e79] text-white flex flex-col justify-center items-center p-10">
          <h2 className="text-4xl font-bold mb-3">PrepTrack</h2>
          <p className="text-sm text-center">
            Start your learning journey 🚀 <br />
            Track progress, stay focused, and grow faster.
          </p>
        </div>

        {/* RIGHT */}
        <div className="w-1/2 p-12">

          <h1 className="text-3xl font-bold mb-6 text-[#0f2a44]">
            Create Account
          </h1>

          {message && (
            <p className="mb-4 text-green-700 bg-green-100 p-3 rounded">
              {message}
            </p>
          )}

          {error && (
            <p className="mb-4 text-red-700 bg-red-100 p-3 rounded">
              {error}
            </p>
          )}

          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Name"
              className="w-full mb-4 p-3 border rounded-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

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
              className="w-full py-3 rounded-lg text-white bg-[#0f2a44]"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-center mt-4">
            Already have an account?{" "}
            <Link to="/" className="text-blue-600">
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}