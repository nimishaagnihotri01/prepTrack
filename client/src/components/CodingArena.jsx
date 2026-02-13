import { useState } from "react";
import Editor from "@monaco-editor/react";
import API from "../api/axios";
import { Play } from "lucide-react";

export default function CodingArena() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(`console.log("Hello PrepTrack 🚀");`);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  // ⭐ RUN CODE
  const runCode = async () => {
    try {
      setLoading(true);
      setOutput("Running... ⚡");

      const res = await API.post("/code/run", {
        language,
        code,
      });

      setOutput(res.data.output || "No output");
    } catch (err) {
      console.log(err);
      setOutput("⚠️ Execution failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl space-y-5">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-[#0f2a44]">
          Coding Arena 💻
        </h2>

        <div className="flex gap-3 items-center">

          {/* LANGUAGE SELECT */}
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

          {/* RUN BUTTON */}
          <button
            onClick={runCode}
            className="flex items-center gap-2 bg-gradient-to-r from-[#0f2a44] to-[#1f4e79] text-white px-5 py-2 rounded-xl hover:scale-105 transition"
          >
            <Play size={18} />
            {loading ? "Running..." : "Run"}
          </button>
        </div>
      </div>

      {/* ⭐ MONACO EDITOR */}
      <div className="rounded-xl overflow-hidden border">
        <Editor
          height="350px"
          theme="vs-dark"
          language={language}
          value={code}
          onChange={(value) => setCode(value)}
        />
      </div>

      {/* ⭐ OUTPUT TERMINAL */}
      <div className="bg-black text-green-400 p-4 rounded-xl h-40 overflow-y-auto font-mono text-sm">
        {output}
      </div>

    </div>
  );
}
