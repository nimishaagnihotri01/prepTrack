import { useState } from "react";
import { Sparkles, X, Send } from "lucide-react";
import API from "../api/axios"; // ⭐ IMPORTANT
import { useRef, useEffect } from "react";

export default function AIAssistant({ collapsed }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    { role: "ai", text: "Hi 👋 I am your PrepTrack AI Assistant!" },
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: "smooth" });
}, [chat]);
  // ⭐ REAL AI CALL
  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;
    setMessage("");

    // add user bubble
    setChat((prev) => [...prev, { role: "user", text: userMessage }]);

    try {
      setLoading(true);

      // ⭐ CALL BACKEND AI ROUTE
      const token = localStorage.getItem("token");

const res = await API.post(
  "/ai/chat",
  { message: userMessage },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);


      setChat((prev) => [
        ...prev,
        { role: "ai", text: res.data.reply },
      ]);
    } catch (err) {
      console.log("AI FRONTEND ERROR:", err);

      setChat((prev) => [
        ...prev,
        { role: "ai", text: "⚠️ AI failed to respond." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 🤖 SIDEBAR BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="
          w-full flex items-center justify-center gap-2
          bg-gradient-to-r from-[#0f2a44] to-[#0f2a44]
          text-white p-4 rounded-xl shadow-lg
          hover:scale-[1.03] transition
        "
      >
        <Sparkles size={18} />
        {!collapsed && "AI Assistant"}
      </button>

      {/* ⭐ SLIDING PANEL */}
      <div
        className={`fixed top-0 right-0 h-full w-[460px] bg-white shadow-2xl z-50 transition-transform duration-300 flex flex-col
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center p-5 border-b bg-gradient-to-r from-[#0f2a44] to-[#1f4e79] text-white">
          <h2 className="font-semibold">🤖 PrepTrack AI</h2>

          <X
            size={20}
            className="cursor-pointer hover:scale-110"
            onClick={() => setOpen(false)}
          />
        </div>

        {/* CHAT AREA */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#f7f9fc]">
          {chat.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[80%] p-3 rounded-xl text-sm shadow
                ${
                  msg.role === "user"
                    ? "ml-auto bg-[#1f4e79] text-white"
                    : "bg-white text-[#0f2a44]"
                }`}
            >
              {msg.text}
            </div>
          ))}

          {/* ⭐ AI THINKING */}
          {loading && (
            <div className="bg-white text-gray-500 italic p-3 rounded-xl w-fit">
              <div className="bg-white p-3 rounded-xl w-fit flex gap-1">
  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
</div>

            </div>
          )}
        </div>

        {/* INPUT BAR */}
        <div className="p-4 border-t flex gap-2 bg-white">
          <input
            value={message} onKeyDown={(e) => {
  if (e.key === "Enter") sendMessage();
}}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask AI anything..."
            className="flex-1 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#1f4e79] text-[#0f2a44]"
          />

          <button
            onClick={sendMessage}
            className="bg-[#1f4e79] text-white px-4 rounded-xl hover:scale-105 transition flex items-center justify-center"
          >
            <Send size={18} />
          </button>
          <div ref={bottomRef} />
        </div>
      </div>

      {/* BACKDROP */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        />
      )}
    </>
  );
}
