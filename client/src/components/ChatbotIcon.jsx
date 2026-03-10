import { TbMessageChatbot } from "react-icons/tb";
import { Link } from "react-router-dom";

function ChatbotIcon() {
  return (
    <div
      className="fixed bottom-5 right-5 z-50 rounded-full p-[3px] animate-spin-slow hover:scale-110 transition-transform duration-200"
      style={{
        background: "conic-gradient(from 0deg, #06b6d4, #8b5cf6, #ec4899, #f59e0b, #10b981, #06b6d4)",
      }}
    >
      <Link
        to="/chat"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-500 text-white shadow-lg"
      >
        <TbMessageChatbot size={34} color="white" />
      </Link>
    </div>
  );
}

export default ChatbotIcon