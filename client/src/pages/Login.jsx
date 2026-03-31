import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import {
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import bg from "../assets/bg.jpg";
import { auth } from "../firebase";
import API from "../api/axios";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      if (!user.emailVerified) {
        await signOut(auth);
        localStorage.removeItem("token");
        setError("Please verify your email first.");
        return;
      }

      const token = await user.getIdToken();
      localStorage.setItem("token", token);

      await API.post("/api/auth/sync-user", {
        name: user.displayName,
      });

      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.log("LOGIN ERROR:", error.code, error.message);

      if (error.code === "auth/user-not-found") {
        setError("User not found");
      } else if (error.code === "auth/wrong-password") {
        setError("Incorrect password");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email");
      } else if (error.code === "auth/invalid-credential") {
        setError("Incorrect email or password");
      } else {
        setError(error.message);
      }
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
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 border rounded-lg"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword((current) => !current)
              }
              className="absolute right-3 top-3"
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white ${
              loading ? "bg-gray-400" : "bg-[#0f2a44]"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
