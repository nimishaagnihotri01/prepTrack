import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, X } from "lucide-react";
import API from "../api/axios";

export default function AIAssistant({ collapsed }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    { role: "ai", text: "Hi! I am your PrepTrack AI Assistant." },
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  const sendMessage = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || loading) {
      return;
    }

    setMessage("");
    setChat((previous) => [
      ...previous,
      { role: "user", text: trimmedMessage },
    ]);

    try {
      setLoading(true);

      const res = await API.post("/api/ai/chat", {
        message: trimmedMessage,
      });

      setChat((previous) => [
        ...previous,
        {
          role: "ai",
          text: res.data.reply?.trim() || "I could not generate a reply.",
        },
      ]);
    } catch (error) {
      console.log("AI FRONTEND ERROR:", error);

      setChat((previous) => [
        ...previous,
        {
          role: "ai",
          text:
            error.response?.data?.reply ||
            "AI failed to respond.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#0f2a44] to-[#0f2a44] text-white p-4 rounded-xl shadow-lg hover:scale-[1.03] transition"
      >
        <Sparkles size={18} />
        {!collapsed && "AI Assistant"}
      </button>

      <div
        className={`fixed top-0 right-0 h-full w-[460px] max-w-full bg-white shadow-2xl z-50 transition-transform duration-300 flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-5 border-b bg-gradient-to-r from-[#0f2a44] to-[#1f4e79] text-white">
          <h2 className="font-semibold">PrepTrack AI</h2>

          <X
            size={20}
            className="cursor-pointer hover:scale-110"
            onClick={() => setOpen(false)}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#f7f9fc]">
          {chat.map((entry, index) => (
            <div
              key={`${entry.role}-${index}`}
              className={`max-w-[80%] p-3 rounded-xl text-sm shadow ${
                entry.role === "user"
                  ? "ml-auto bg-[#1f4e79] text-white"
                  : "bg-white text-[#0f2a44]"
              }`}
            >
              {entry.text}
            </div>
          ))}

          {loading && (
            <div className="bg-white p-3 rounded-xl w-fit flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="p-4 border-t flex gap-2 bg-white">
          <input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                void sendMessage();
              }
            }}
            placeholder="Ask AI anything..."
            className="flex-1 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#1f4e79] text-[#0f2a44]"
          />

          <button
            onClick={() => void sendMessage()}
            disabled={loading}
            className="bg-[#1f4e79] text-white px-4 rounded-xl hover:scale-105 transition flex items-center justify-center disabled:opacity-60 disabled:hover:scale-100"
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        />
      )}
    </>
  );
}
