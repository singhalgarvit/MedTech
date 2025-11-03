import { TbMessageChatbot } from "react-icons/tb";
import { Link } from "react-router-dom";

function ChatbotIcon() {
  return (
    <Link to='/chat' className="fixed bottom-5 right-5 z-50 bg-blue-500 p-2 rounded-full">
        <TbMessageChatbot size={30} color="white"/>
    </Link>
  )
}

export default ChatbotIcon