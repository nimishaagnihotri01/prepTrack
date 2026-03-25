import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

export default function Verify() {
  const { token } = useParams();
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await API.get(`/api/auth/verify/${token}`);
        setMessage(res.data.message);
      } catch (err) {
        setMessage("Verification failed or expired.");
      }
    };

    verifyUser();
  }, [token]);

  return (
    <div className="h-screen flex items-center justify-center">
      <h1 className="text-2xl font-bold">{message}</h1>
    </div>
  );
}