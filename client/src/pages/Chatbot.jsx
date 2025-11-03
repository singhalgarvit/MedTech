import { useEffect, useRef, useState } from "react";
import Button from "../components/Button";
import { BsSend } from "react-icons/bs";
import {GoogleGenerativeAI} from "@google/generative-ai"

export default function Chatbot() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newChat = [...chat, { role: "user", content: message }];
    setChat(newChat);
    setMessage("");
    const apiKey = import.meta.env.VITE_ai_api;
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const systemPrompt = `
      You are Dr. MedTechBot developed by Garvit & team — a friendly and professional **medical advisor**.
      Respond as a certified doctor who gives evidence-based, empathetic answers.
      Keep responses **under 100 words** unless a detailed explanation is clearly necessary.
      Avoid providing diagnoses or prescriptions — give **general medical guidance** only.
      Dont give advice other than medical field.
    `;
    const prompt = `${systemPrompt}\n\nUser: ${message}\nDoctor:`;
     const result = await model.generateContent(prompt);

    // const res = await fetch(, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ message }),
    // });

    // const data = await res.json();
    const response = result.response.text();
    setChat([...newChat, { role: "assistant", content: response }]);
  };

  return (
    <div className="flex flex-col items-center justify-center p-3">
      <div className="md:w-3/4 bg-white rounded-lg flex flex-col h-[85vh] md:h-[75vh] shadow-sm">
        {/* Chat area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
          {chat.length === 0 ? (
            <p className="text-gray-500 text-center italic">
              👋 Start the conversation by typing a message below!
            </p>
          ) : (
            chat.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-lg max-w-[90%] md:max-w-[75%] ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input area */}
        <form
          onSubmit={sendMessage}
          className="p-3 m-3 flex gap-2 fixed bottom-0 w-full md:w-2/3 self-center"
        >
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your Query..."
          />
          <Button
            type="submit"
            onclick={() => {}}
            value="Send "
            icon={<BsSend className="inline-block " size={15} />}
            className="flex flex-row items-center justify-center gap-2"
          />
        </form>
      </div>
    </div>
  );
}
