import { lazy, Suspense, useState } from "react";
import API from "../api/axios";

const MonacoEditor = lazy(() => import("@monaco-editor/react"));

export default function CodeEditorPage() {
  const [code, setCode] = useState("console.log('Start coding');");
  const [output, setOutput] = useState("");

  const runCode = async () => {
    try {
      const res = await API.post("/api/code/run", {
        code,
        language: "javascript",
      });

      setOutput(res.data.output);
    } catch (error) {
      console.log("CODE EDITOR RUN ERROR:", error);
      setOutput(
        error.response?.data?.output || "Execution failed"
      );
    }
  };

  return (
    <div className="h-screen flex flex-col p-6 bg-[#eef3f9]">
      <div className="flex-1 border rounded-xl overflow-hidden">
        <Suspense
          fallback={
            <div className="h-full bg-slate-900 text-slate-100 flex items-center justify-center">
              Loading editor...
            </div>
          }
        >
          <MonacoEditor
            height="100%"
            language="javascript"
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value ?? "")}
          />
        </Suspense>
      </div>

      <button
        onClick={() => void runCode()}
        className="mt-4 bg-[#1f4e79] text-white px-6 py-3 rounded-xl"
      >
        Run Code
      </button>

      <div className="bg-black text-green-400 p-4 mt-4 rounded-xl min-h-[120px] whitespace-pre-wrap">
        {output}
      </div>
    </div>
  );
}
