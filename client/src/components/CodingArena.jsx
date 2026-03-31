import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import API from "../api/axios";

const MonacoEditor = lazy(() => import("@monaco-editor/react"));

const DEFAULT_CODE = {
  javascript: "console.log('Start coding');",
  python: "print('Start coding')",
};

const SUPPORTED_LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
];

export default function CodingArena({ taskId }) {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(DEFAULT_CODE.javascript);
  const [output, setOutput] = useState("");
  const [workspaceReady, setWorkspaceReady] = useState(false);
  const lastSavedRef = useRef({
    taskId: null,
    language: "javascript",
    code: DEFAULT_CODE.javascript,
  });

  useEffect(() => {
    let ignore = false;

    if (!taskId) {
      setWorkspaceReady(false);
      setLanguage("javascript");
      setCode(DEFAULT_CODE.javascript);
      return undefined;
    }

    const loadWorkspace = async () => {
      try {
        setWorkspaceReady(false);
        setOutput("");

        const res = await API.get(`/api/workspace/${taskId}`);
        const nextLanguage = SUPPORTED_LANGUAGES.some(
          (item) => item.value === res.data.language
        )
          ? res.data.language
          : "javascript";
        const nextCode =
          res.data.code || DEFAULT_CODE[nextLanguage];

        if (ignore) {
          return;
        }

        setLanguage(nextLanguage);
        setCode(nextCode);
        lastSavedRef.current = {
          taskId,
          language: nextLanguage,
          code: nextCode,
        };
      } catch (error) {
        console.log("WORKSPACE LOAD ERROR:", error);

        if (ignore) {
          return;
        }

        setLanguage("javascript");
        setCode(DEFAULT_CODE.javascript);
        setOutput("Unable to load workspace.");
        lastSavedRef.current = {
          taskId,
          language: "javascript",
          code: DEFAULT_CODE.javascript,
        };
      } finally {
        if (!ignore) {
          setWorkspaceReady(true);
        }
      }
    };

    void loadWorkspace();

    return () => {
      ignore = true;
    };
  }, [taskId]);

  useEffect(() => {
    if (!taskId || !workspaceReady) {
      return undefined;
    }

    const lastSaved = lastSavedRef.current;

    if (
      lastSaved.taskId === taskId &&
      lastSaved.language === language &&
      lastSaved.code === code
    ) {
      return undefined;
    }

    const timer = setTimeout(() => {
      const saveWorkspace = async () => {
        try {
          await API.post(`/api/workspace/${taskId}`, {
            code,
            language,
          });

          lastSavedRef.current = {
            taskId,
            language,
            code,
          };
        } catch (error) {
          console.log("WORKSPACE SAVE ERROR:", error);
        }
      };

      void saveWorkspace();
    }, 800);

    return () => clearTimeout(timer);
  }, [code, language, taskId, workspaceReady]);

  const runCode = async () => {
    try {
      setOutput("Running...");

      const res = await API.post("/api/code/run", {
        code,
        language,
      });

      setOutput(res.data.output);
    } catch (error) {
      console.log("RUN CODE ERROR:", error);
      setOutput(
        error.response?.data?.output || "Execution failed"
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between gap-4">
        <select
          value={language}
          onChange={(event) => {
            const nextLanguage = event.target.value;
            setLanguage(nextLanguage);
            setCode((currentCode) =>
              currentCode.trim()
                ? currentCode
                : DEFAULT_CODE[nextLanguage]
            );
          }}
          className="border p-2 rounded-xl"
        >
          {SUPPORTED_LANGUAGES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <button
          onClick={() => void runCode()}
          className="flex gap-2 bg-gradient-to-r from-[#0f2a44] to-[#1f4e79] text-white px-5 py-2 rounded-xl"
        >
          <Play size={18} /> Run
        </button>
      </div>

      <Suspense
        fallback={
          <div className="h-[350px] rounded-xl border bg-slate-900 text-slate-100 flex items-center justify-center">
            Loading editor...
          </div>
        }
      >
        <MonacoEditor
          height="350px"
          theme="vs-dark"
          language={language}
          value={code}
          onChange={(value) => setCode(value ?? "")}
        />
      </Suspense>

      <div className="bg-black text-green-400 p-4 rounded-xl h-40 overflow-y-auto font-mono whitespace-pre-wrap">
        {output}
      </div>
    </div>
  );
}
