import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import API from "../api/axios";
import { auth } from "../firebase";

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        localStorage.removeItem("token");

        if (!ignore) {
          setUser(null);
          setLoading(false);
        }

        return;
      }

      try {
        const token = await currentUser.getIdToken();
        localStorage.setItem("token", token);

        try {
          await API.post("/api/auth/sync-user", {
            name: currentUser.displayName,
          });
        } catch (syncError) {
          console.log("SYNC USER ERROR:", syncError);
        }

        if (!ignore) {
          setUser(currentUser);
        }
      } catch {
        localStorage.removeItem("token");

        if (!ignore) {
          setUser(null);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    });

    return () => {
      ignore = true;
      unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eef3f9] text-[#0f2a44]">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!user.emailVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eef3f9] px-6 text-center text-[#0f2a44]">
        Please verify your email before accessing PrepTrack.
      </div>
    );
  }

  return children;
}
