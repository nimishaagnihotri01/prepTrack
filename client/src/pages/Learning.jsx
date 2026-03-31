import { lazy, Suspense, useEffect, useState } from "react";
import { CheckCircle2, Code2, Trash2 } from "lucide-react";
import API from "../api/axios";

const CodingArena = lazy(() => import("../components/CodingArena"));

export default function Learning() {
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [learning, setLearning] = useState([]);
  const [openArena, setOpenArena] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    let ignore = false;

    const loadLearning = async () => {
      try {
        const res = await API.get("/api/learning");

        if (!ignore) {
          setLearning(res.data);
        }
      } catch (error) {
        console.log("Fetch failed", error);
      }
    };

    void loadLearning();

    return () => {
      ignore = true;
    };
  }, []);

  const addLearning = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    try {
      const res = await API.post("/api/learning", {
        title,
        difficulty,
      });

      setLearning((current) => [res.data, ...current]);
      setTitle("");
      setDifficulty("Easy");
    } catch (error) {
      console.log("Add failed", error);
    }
  };

  const deleteLearning = async (id) => {
    try {
      await API.delete(`/api/learning/${id}`);
      setLearning((current) =>
        current.filter((item) => item._id !== id)
      );
    } catch (error) {
      console.log("Delete failed", error);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const res = await API.patch(`/api/learning/${id}`);

      setLearning((current) =>
        current.map((item) =>
          item._id === id ? res.data : item
        )
      );
    } catch (error) {
      console.log("Toggle failed", error);
    }
  };

  const closeArena = () => {
    setOpenArena(false);
    setSelectedTask(null);
  };

  const getBadge = (level) => {
    if (level === "Easy") return "bg-green-100 text-green-600";
    if (level === "Medium") return "bg-yellow-100 text-yellow-600";
    if (level === "Hard") return "bg-red-100 text-red-600";
    return "bg-gray-100 text-gray-500";
  };

  const completed = learning.filter(
    (item) => item.status === "Completed"
  ).length;

  const progress =
    learning.length === 0
      ? 0
      : Math.round((completed / learning.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef3f9] to-[#dde6f1] p-10">
      <h1 className="text-3xl font-bold text-[#0f2a44] mb-8">
        My Learning
      </h1>

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
            className="h-3 bg-gradient-to-r from-[#0f2a44] to-[#1f4e79]"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <form
        onSubmit={addLearning}
        className="bg-white p-6 rounded-2xl shadow mb-10 flex gap-4 items-center flex-col md:flex-row"
      >
        <input
          type="text"
          placeholder="Add Topic..."
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="flex-1 p-3 border rounded-xl w-full"
        />

        <select
          value={difficulty}
          onChange={(event) => setDifficulty(event.target.value)}
          className="p-3 border rounded-xl w-full md:w-auto"
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        <button className="bg-gradient-to-r from-[#0f2a44] to-[#1f4e79] text-white px-6 py-3 rounded-xl w-full md:w-auto">
          Add
        </button>
      </form>

      {learning.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl shadow text-center text-gray-500">
          No topics yet - start building your learning journey.
        </div>
      ) : (
        <div className="grid gap-4">
          {learning.map((item) => {
            const level = item.difficulty || item.level;

            return (
              <div
                key={item._id}
                className="bg-white p-5 rounded-xl shadow flex justify-between items-center gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <CheckCircle2
                    onClick={() => void toggleStatus(item._id)}
                    className={`cursor-pointer shrink-0 ${
                      item.status === "Completed"
                        ? "text-green-500"
                        : "text-gray-300"
                    }`}
                  />

                  <div className="min-w-0">
                    <h3
                      className={`font-semibold truncate ${
                        item.status === "Completed"
                          ? "line-through opacity-50"
                          : ""
                      }`}
                    >
                      {item.title}
                    </h3>

                    <span
                      className={`text-xs px-3 py-1 rounded-full ${getBadge(level)}`}
                    >
                      {level}
                    </span>
                  </div>
                </div>

                <div className="flex gap-4 shrink-0">
                  <Code2
                    onClick={() => {
                      setSelectedTask(item);
                      setOpenArena(true);
                    }}
                    className="cursor-pointer"
                  />

                  <Trash2
                    onClick={() => void deleteLearning(item._id)}
                    className="cursor-pointer text-red-500"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {openArena && selectedTask && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-[90%] max-w-5xl rounded-2xl p-6 relative">
            <button
              onClick={closeArena}
              className="absolute top-4 right-4"
            >
              X
            </button>

            <h2 className="text-xl font-bold mb-4">
              Coding Arena - {selectedTask.title}
            </h2>

            <Suspense
              fallback={
                <div className="h-[350px] rounded-xl border flex items-center justify-center">
                  Loading editor...
                </div>
              }
            >
              <CodingArena taskId={selectedTask._id} />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
}
