import { useEffect, useState } from "react";
import API from "../api/axios";
import { LogOut } from "lucide-react";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler
);

export default function Dashboard() {
  const [openMenu, setOpenMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [learning, setLearning] = useState([]);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // 🔥 LOAD DATA
  useEffect(() => {
    const loadData = async () => {
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
        console.log("Dashboard fetch failed");
      }
    };

    loadData();
  }, []);

  // 🌅 GREETING
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // 📊 PROGRESS
  const completed = learning.filter(
    (item) => item.status === "Completed"
  ).length;

  const progress =
    learning.length === 0
      ? 0
      : Math.round((completed / learning.length) * 100);

  // ⭐ WEEKLY ANALYTICS
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const weeklyCount = {
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
    Sun: 0,
  };

  learning.forEach((item) => {
  if (!item.completedAt) return; // ⭐ only completed tasks

  const date = new Date(item.completedAt);
  const dayIndex = date.getDay();
  const mappedDay = days[dayIndex === 0 ? 6 : dayIndex - 1];

  weeklyCount[mappedDay]++;
});


  const chartData = {
    labels: days,
    datasets: [
      {
        label: "Weekly Progress",
        data: days.map((d) => weeklyCount[d]),
        borderColor: "#1f4e79",
        backgroundColor: "rgba(31,78,121,0.15)",
        tension: 0.5,
        pointRadius: 5,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    plugins: { legend: { display: false } },
    maintainAspectRatio: false,
  };

  return (
    <div className="flex flex-col min-h-screen">

      {/* ⭐ TOP NAVBAR */}
      <div className="flex justify-between items-center px-10 py-5 bg-white/60 backdrop-blur-md border-b shadow-sm">
        <h2 className="text-2xl font-bold text-[#0f2a44]">
          Dashboard
        </h2>

        <div className="relative">
          <div
            onClick={() => setOpenMenu(!openMenu)}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-[#0f2a44] to-[#1f4e79] text-white flex items-center justify-center cursor-pointer"
          >
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>

          {openMenu && (
            <div className="absolute right-0 mt-3 bg-white rounded-xl shadow-lg p-4 w-40">
              <button
                onClick={logout}
                className="flex items-center gap-2 text-[#0f2a44] hover:text-red-500"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ⭐ CONTENT */}
      <div className="p-10 space-y-10">

        {/* HERO */}
        <div className="bg-gradient-to-r from-[#0f2a44] to-[#1f4e79] text-white p-10 rounded-3xl shadow-lg">
          <h3 className="text-3xl font-semibold mb-2">
            {user
              ? `${getGreeting()}, ${user.name} 👋`
              : "Loading..."}
          </h3>
          <p>Your real weekly learning analytics.</p>
        </div>

        {/* ANALYTICS CARDS */}
        <div className="grid grid-cols-3 gap-8">

          <div className="bg-white p-8 rounded-2xl shadow text-center">
            <p className="text-gray-500">Progress</p>
            <h3 className="text-4xl font-bold text-[#1f4e79]">
              {progress}%
            </h3>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow text-center">
            <p className="text-gray-500">Total Topics</p>
            <h3 className="text-4xl font-bold text-[#1f4e79]">
              {learning.length}
            </h3>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow text-center">
            <p className="text-gray-500">Completed</p>
            <h3 className="text-4xl font-bold text-[#1f4e79]">
              {completed}
            </h3>
          </div>

        </div>

        {/* ⭐ FULL WIDTH CURVED CHART */}
        <div className="bg-white p-6 rounded-2xl shadow w-full">
          <h4 className="text-[#0f2a44] font-semibold mb-4">
            Weekly Progress (Mon-Sun)
          </h4>

          <div className="h-48 w-full">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

      </div>
    </div>
  );
}
