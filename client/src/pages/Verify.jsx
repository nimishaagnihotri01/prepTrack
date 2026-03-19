import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Verify() {
  const { token } = useParams();
  const navigate = useNavigate();

  const called = useRef(false); // ⭐ FIX
  const [message, setMessage] = useState("Verifying account...");

  useEffect(() => {
    if (!token || called.current) return;

    called.current = true; // prevent double call

    const verifyAccount = async () => {
      try {
        await API.get(`/auth/verify/${token}`);
        setMessage("✅ Account verified successfully!");

        setTimeout(() => {
          navigate("/");
        }, 2000);
      } catch (err) {
        setMessage(
          err.response?.data?.message || "❌ Verification failed"
        );
      }
    };

    verifyAccount();
  }, [token, navigate]);

  return (
    <div className="h-screen flex items-center justify-center">
      <h2 className="text-xl font-semibold text-[#0f2a44]">
        {message}
      </h2>
    </div>
  );
}