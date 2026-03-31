import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  updateProfile,
} from "firebase/auth";
import bg from "../assets/bg.jpg";
import { auth } from "../firebase";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, {
        displayName: name.trim(),
      });

      await sendEmailVerification(userCredential.user);
      await signOut(auth);

      setMessage("Verification email sent. Check your inbox/Spam.");
      setPassword("");
    } catch (error) {
      console.log("REGISTER ERROR:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="flex bg-white/90 shadow-xl rounded-3xl overflow-hidden w-[800px] max-w-[95vw]">
        <div className="w-1/2 bg-gradient-to-br from-[#0f2a44] to-[#1f4e79] text-white flex flex-col justify-center items-center p-10">
          <h2 className="text-4xl font-bold mb-3">PrepTrack</h2>
        </div>

        <div className="w-1/2 p-12">
          <h1 className="text-3xl font-bold mb-6 text-[#0f2a44]">
            Create Account
          </h1>

          {message && <p className="mb-4 text-green-600">{message}</p>}
          {error && <p className="mb-4 text-red-600">{error}</p>}

          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Name"
              className="w-full mb-4 p-3 border rounded-lg"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />

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
              className="w-full py-3 bg-[#0f2a44] text-white rounded-lg disabled:opacity-70"
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="mt-4">
            Already have an account? <Link to="/">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
