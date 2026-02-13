import Editor from "@monaco-editor/react";
import { useState } from "react";
import API from "../api/axios";

export default function CodeEditorPage() {

  const [code, setCode] = useState("// write code here");
  const [output, setOutput] = useState("");

  const runCode = async () => {
    try {
      const res = await API.post("/code/run", {
        source_code: code,
        language_id: 63 // JavaScript
      });

      setOutput(res.data.output);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="h-screen flex flex-col p-6 bg-[#eef3f9]">

      <div className="flex-1 border rounded-xl overflow-hidden">
        <Editor
          height="100%"
          language="javascript"
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value)}
        />
      </div>

      <button
        onClick={runCode}
        className="mt-4 bg-[#1f4e79] text-white px-6 py-3 rounded-xl"
      >
        Run Code
      </button>

      <div className="bg-black text-green-400 p-4 mt-4 rounded-xl min-h-[120px]">
        {output}
      </div>

    </div>
  );
}
