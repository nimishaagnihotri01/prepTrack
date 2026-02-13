import { useEffect, useState } from "react";
import API from "../api/axios";
import { User, Mail, Calendar, Trophy } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [learning, setLearning] = useState([]);

  // 🔥 FETCH PROFILE + LEARNING
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const profileRes = await API.get("/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const learningRes = await API.get("/learning", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(profileRes.data);
        setLearning(learningRes.data);
      } catch (err) {
        console.log("Profile load failed");
      }
    };

    fetchData();
  }, []);

  if (!user) {
    return (
      <div className="p-10 text-[#0f2a44] font-semibold">
        Loading profile...
      </div>
    );
  }

  // ⭐ CALCULATE PROGRESS
  const completed = learning.filter(
    (item) => item.status === "Completed"
  ).length;

  const progress =
    learning.length === 0
      ? 0
      : Math.round((completed / learning.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef3f9] to-[#dde6f1] p-10">

      {/* 🔥 HERO PROFILE CARD */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 mb-10 flex justify-between items-center">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-6">
          {/* ⭐ AVATAR */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#0f2a44] to-[#1f4e79] flex items-center justify-center text-white text-3xl font-bold shadow-xl">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            {/* Glow ring */}
            <div className="absolute inset-0 rounded-full border-4 border-blue-300 opacity-30 animate-pulse"></div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-[#0f2a44]">
              {user.name}
            </h2>
            <p className="text-gray-500">
              PrepTrack Learner 🚀
            </p>
          </div>
        </div>

        {/* ⭐ REAL PROGRESS RING (NO GAPS) */}
        <div className="relative w-28 h-28 flex items-center justify-center">

          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(#1f4e79 ${progress}%, #e5e7eb ${progress}%)`,
            }}
          ></div>

          {/* INNER CIRCLE */}
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-inner z-10">
            <span className="font-bold text-[#0f2a44]">
              {progress}%
            </span>
          </div>

        </div>
      </div>

      {/* ⭐ PROFILE GRID */}
      <div className="grid grid-cols-2 gap-8">

        {/* 🧾 ACCOUNT DETAILS */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-[#0f2a44] mb-6">
            Account Information
          </h3>

          <div className="space-y-6">

            <div className="flex items-center gap-4">
              <User className="text-[#1f4e79]" />
              <span>{user.name}</span>
            </div>

            <div className="flex items-center gap-4">
              <Mail className="text-[#1f4e79]" />
              <span>{user.email}</span>
            </div>

            <div className="flex items-center gap-4">
              <Calendar className="text-[#1f4e79]" />
              <span>
                Joined {new Date(user.createdAt).toDateString()}
              </span>
            </div>

          </div>
        </div>

        {/* 📊 LEARNING STATS */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-[#0f2a44] mb-6">
            Learning Stats
          </h3>

          <div className="grid grid-cols-2 gap-6">

            <div className="bg-[#eef3f9] p-6 rounded-xl">
              <p className="text-sm text-gray-500">
                Total Topics
              </p>
              <h4 className="text-3xl font-bold text-[#1f4e79]">
                {learning.length}
              </h4>
            </div>

            <div className="bg-[#eef3f9] p-6 rounded-xl">
              <p className="text-sm text-gray-500">
                Completed
              </p>
              <h4 className="text-3xl font-bold text-green-500">
                {completed}
              </h4>
            </div>

            <div className="bg-[#eef3f9] p-6 rounded-xl col-span-2">
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Trophy size={18} /> Progress Level
              </p>
              <h4 className="text-2xl font-bold text-[#0f2a44]">
                {progress > 70
                  ? "Advanced Learner"
                  : progress > 30
                  ? "Growing Learner"
                  : "Beginner"}
              </h4>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
