import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Verify() {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        await API.get(`/auth/verify/${token}`);
        alert("✅ Account verified successfully!");
        navigate("/");
      } catch (err) {
        alert("❌ Verification failed");
      }
    };

    verifyAccount();
  }, []);

  return (
    <div className="h-screen flex items-center justify-center text-xl">
      Verifying account...
    </div>
  );
}
