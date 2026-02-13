import { useEffect, useState } from "react";
import API from "../api/axios";
import { Trash2, CheckCircle2 } from "lucide-react";

export default function Learning() {
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [learning, setLearning] = useState([]);

  // 🔥 FETCH ITEMS
  const fetchLearning = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/learning", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLearning(res.data);
    } catch (err) {
      console.log("Fetch failed");
    }
  };

  useEffect(() => {
    fetchLearning();
  }, []);

  // ➕ ADD
  const addLearning = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const token = localStorage.getItem("token");

      const res = await API.post(
        "/learning",
        { title, difficulty },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLearning([res.data, ...learning]);
      setTitle("");
    } catch (err) {
      console.log("Add failed");
    }
  };

  // ❌ DELETE
  const deleteLearning = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.delete(`/learning/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLearning(learning.filter((item) => item._id !== id));
    } catch (err) {
      console.log("Delete failed");
    }
  };

  // ⭐ TOGGLE STATUS
  const toggleStatus = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.patch(
        `/learning/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLearning(
        learning.map((item) =>
          item._id === id ? res.data : item
        )
      );
    } catch (err) {
      console.log("Toggle failed");
    }
  };

  // 🎨 Difficulty badge (FIXED)
  const getBadge = (level) => {
    if (level === "Easy") return "bg-green-100 text-green-600";
    if (level === "Medium") return "bg-yellow-100 text-yellow-600";
    if (level === "Hard") return "bg-red-100 text-red-600";
    return "bg-gray-100 text-gray-500";
  };

  // 📊 PROGRESS CALCULATION
  const completed = learning.filter(
    (item) => item.status === "Completed"
  ).length;

  const progress =
    learning.length === 0
      ? 0
      : Math.round((completed / learning.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef3f9] to-[#dde6f1] p-10">

      {/* HEADER */}
      <h1 className="text-3xl font-bold text-[#0f2a44] mb-8">
        My Learning 🚀
      </h1>

      {/* 💎 PROGRESS CARD */}
      <div className="bg-white p-6 rounded-2xl shadow mb-10">
        <div className="flex justify-between mb-3">
          <p className="font-semibold text-[#0f2a44]">
            Completion Progress
          </p>
          <p className="font-bold text-[#1f4e79]">
            {progress}%
          </p>
        </div>

        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-3 bg-gradient-to-r from-[#0f2a44] to-[#1f4e79] transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* ➕ ADD FORM */}
      <form
        onSubmit={addLearning}
        className="bg-white p-6 rounded-2xl shadow mb-10 flex gap-4 items-center"
      >
        <input
          type="text"
          placeholder="Add Topic..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 p-3 border rounded-xl focus:ring-2 focus:ring-[#1f4e79]"
        />

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="p-3 border rounded-xl"
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        <button className="bg-gradient-to-r from-[#0f2a44] to-[#1f4e79] text-white px-6 py-3 rounded-xl hover:scale-105 transition">
          Add
        </button>
      </form>

      {/* 📋 LIST */}
      {learning.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl shadow text-center text-gray-500">
          No topics yet — start building your learning journey ✨
        </div>
      ) : (
        <div className="grid gap-4">
          {learning.map((item) => {
            const level = item.difficulty || item.level; // ⭐ FIX HERE

            return (
              <div
                key={item._id}
                className="bg-white/90 backdrop-blur-lg p-5 rounded-xl shadow flex justify-between items-center hover:shadow-xl hover:-translate-y-1 transition"
              >
                <div className="flex items-center gap-4">

                  {/* CHECK ICON */}
                  <CheckCircle2
                    onClick={() => toggleStatus(item._id)}
                    className={`cursor-pointer transition ${
                      item.status === "Completed"
                        ? "text-green-500 scale-110"
                        : "text-gray-300"
                    }`}
                  />

                  <div>
                    <h3
                      className={`font-semibold text-[#0f2a44] ${
                        item.status === "Completed"
                          ? "line-through opacity-50"
                          : ""
                      }`}
                    >
                      {item.title}
                    </h3>

                    {/* ⭐ COLORED BADGE */}
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${getBadge(
                        level
                      )}`}
                    >
                      {level}
                    </span>
                  </div>
                </div>

                <Trash2
                  onClick={() => deleteLearning(item._id)}
                  className="cursor-pointer text-red-500 hover:scale-110 transition"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
