import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  Filler,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import API from "../api/axios";
import { auth } from "../firebase";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler
);

export default function Dashboard() {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [learning, setLearning] = useState([]);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log("LOGOUT ERROR:", error);
    } finally {
      localStorage.removeItem("token");
      navigate("/", { replace: true });
    }
  };

  useEffect(() => {
    let ignore = false;

    const loadData = async () => {
      try {
        const [profileRes, learningRes] = await Promise.all([
          API.get("/api/user/profile"),
          API.get("/api/learning"),
        ]);

        if (ignore) {
          return;
        }

        setUser(profileRes.data);
        setLearning(learningRes.data);
      } catch (error) {
        console.log("Dashboard fetch failed", error);
      }
    };

    void loadData();

    return () => {
      ignore = true;
    };
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const completed = learning.filter(
    (item) => item.status === "Completed"
  ).length;

  const progress =
    learning.length === 0
      ? 0
      : Math.round((completed / learning.length) * 100);

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

  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - (day === 0 ? 6 : day - 1);
  const startOfWeek = new Date(now);
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  learning.forEach((item) => {
    if (!item.completedAt) {
      return;
    }

    const date = new Date(item.completedAt);

    if (date < startOfWeek || date > endOfWeek) {
      return;
    }

    const dayIndex = date.getDay();
    const mappedDay = days[dayIndex === 0 ? 6 : dayIndex - 1];
    weeklyCount[mappedDay] += 1;
  });

  const chartData = {
    labels: days,
    datasets: [
      {
        label: "Weekly Progress",
        data: days.map((dayLabel) => weeklyCount[dayLabel]),
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
      <div className="flex justify-between items-center px-10 py-5 bg-white/60 backdrop-blur-md border-b shadow-sm">
        <h2 className="text-2xl font-bold text-[#0f2a44]">
          Dashboard
        </h2>

        <div className="relative">
          <div
            onClick={() => setOpenMenu((current) => !current)}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-[#0f2a44] to-[#1f4e79] text-white flex items-center justify-center cursor-pointer"
          >
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>

          {openMenu && (
            <div className="absolute right-0 mt-3 bg-white rounded-xl shadow-lg p-4 w-40">
              <button
                onClick={() => void logout()}
                className="flex items-center gap-2 text-[#0f2a44] hover:text-red-500"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-10 space-y-10">
        <div className="bg-gradient-to-r from-[#0f2a44] to-[#1f4e79] text-white p-10 rounded-3xl shadow-lg">
          <h3 className="text-3xl font-semibold mb-2">
            {user
              ? `${getGreeting()}, ${user.name}!`
              : "Loading..."}
          </h3>
          <p>Your real weekly learning analytics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
