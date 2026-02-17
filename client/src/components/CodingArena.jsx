import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import API from "../api/axios";
import { Play } from "lucide-react";

export default function CodingArena({ taskId }) {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");

  // ⭐ LOAD WORKSPACE
  useEffect(() => {
    const loadWorkspace = async () => {
      const token = localStorage.getItem("token");

      const res = await API.get(`/workspace/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCode(res.data.code);
      setLanguage(res.data.language);
    };

    if (taskId) loadWorkspace();
  }, [taskId]);

  // ⭐ AUTO SAVE (DEBOUNCED)
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!taskId) return;

      const token = localStorage.getItem("token");

      await API.post(
        `/workspace/${taskId}`,
        { code, language },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }, 2000);

    return () => clearTimeout(timer);
  }, [code, language]);

  // ⭐ RUN CODE
  const runCode = async () => {
  try {
    setOutput("Running...");

    const token = localStorage.getItem("token"); // ⭐ ADD THIS

    const res = await API.post(
      "/code/run",
      {
        code,
        language,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // ⭐ THIS FIXES 401
        },
      }
    );

    setOutput(res.data.output);
  } catch (err) {
    console.log(err);
    setOutput("Execution failed");
  }
};



  return (
    <div className="space-y-4">
      <div className="flex justify-between">

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border p-2 rounded-xl"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>

        <button
          onClick={runCode}
          className="flex gap-2 bg-gradient-to-r from-[#0f2a44] to-[#1f4e79] text-white px-5 py-2 rounded-xl"
        >
          <Play size={18} /> Run
        </button>
      </div>

      <Editor
        height="350px"
        theme="vs-dark"
        language={language}
        value={code}
        onChange={(value) => setCode(value)}
      />

      <div className="bg-black text-green-400 p-4 rounded-xl h-40 overflow-y-auto font-mono">
        {output}
      </div>
    </div>
  );
}
