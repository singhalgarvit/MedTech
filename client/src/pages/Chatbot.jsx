import { useEffect, useRef, useState } from "react";
import { BsSend } from "react-icons/bs";
import { HiOutlineSparkles } from "react-icons/hi";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getChatHistory, saveChatInBackground } from "../services/chatService.js";
import { ChatSkeleton } from "../components/Skeleton";

export default function Chatbot() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  useEffect(() => {
    getChatHistory()
      .then(({ messages }) => {
        if (messages?.length) setChat(messages);
      })
      .catch(() => {})
      .finally(() => setHistoryLoaded(true));
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newChat = [...chat, { role: "user", content: message }];
    setChat(newChat);
    setMessage("");
    const apiKey = import.meta.env.VITE_ai_api;
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    const systemPrompt = `
      You are Dr. MedTechBot developed by Garvit & team — a friendly and professional **medical advisor**.
      Respond as a certified doctor who gives evidence-based, empathetic answers.
      Keep responses **under 100 words** unless a detailed explanation is clearly necessary.
      Avoid providing diagnoses or prescriptions — give **general medical guidance** only.
      Dont give advice other than medical field.
    `;
    const prompt = `${systemPrompt}\n\nUser: ${message}\nDoctor:`;
    try {
      setLoading(true);
      const result = await model.generateContent(prompt);
      const response = result.response.text();
      const updatedChat = [...newChat, { role: "assistant", content: response }];
      setChat(updatedChat);
      saveChatInBackground(updatedChat);
    } catch (err) {
      const fallbackChat = [
        ...newChat,
        {
          role: "assistant",
          content: "Something went wrong. Please try again...",
        },
      ];
      setChat(fallbackChat);
      saveChatInBackground(fallbackChat);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex flex-col items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-5xl bg-white/90 backdrop-blur-sm rounded-2xl flex flex-col h-[88vh] md:h-[80vh] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        {/* Header */}
        {/* <header className="shrink-0 flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-blue-800 to-blue-900 text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
            <HiOutlineSparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-semibold text-lg tracking-tight">Dr. MedTechBot</h1>
            <p className="text-blue-100 text-xs">General medical guidance · By Garvit & team</p>
          </div>
        </header> */}

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4 no-scrollbar bg-slate-50/50">
          {!historyLoaded && chat.length === 0 ? (
            <ChatSkeleton />
          ) : chat.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center px-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 mb-4">
                <HiOutlineSparkles className="h-7 w-7" />
              </div>
              <p className="text-slate-600 font-medium">How can I help you today?</p>
              <p className="text-slate-400 text-sm mt-1 max-w-xs">
                Ask about symptoms, wellness, or general health — I’m here to guide you.
              </p>
            </div>
          ) : (
            chat.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-blue-600 mt-0.5">
                    <HiOutlineSparkles className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`px-4 py-2.5 rounded-2xl max-w-[85%] md:max-w-[78%] text-[15px] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-md shadow-md shadow-emerald-900/20"
                      : "bg-white text-slate-700 rounded-bl-md shadow-sm border border-slate-100"
                  }`}
                >
                  <span className="whitespace-pre-wrap break-words">{msg.content}</span>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex gap-2 justify-start">
              <div className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 mt-0.5">
                <HiOutlineSparkles className="h-4 w-4" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white border border-slate-100 shadow-sm">
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-slate-300 animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 rounded-full bg-slate-300 animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 rounded-full bg-slate-300 animate-bounce" />
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input area */}
        <form
          onSubmit={sendMessage}
          className="shrink-0 p-3 md:p-4 bg-white border-t border-slate-100"
        >
          <div className="flex gap-2 md:gap-3">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-shadow"
              placeholder="Type your query..."
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white font-medium shadow-md shadow-emerald-900/20 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors disabled:opacity-60 disabled:pointer-events-none"
              disabled={loading}
            >
              <BsSend className="h-4 w-4" />
              <span>Send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
