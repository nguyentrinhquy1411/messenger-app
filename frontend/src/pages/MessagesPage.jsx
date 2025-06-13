import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";
import Sidebar from "../components/SideBar";
import { useChatStore } from "../store/useChatStore";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

const MessagesPage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-base-200">
      {/* Back to Home Button */}
      <div className="absolute top-4 left-4 z-50">
        <Link
          to="/"
          className="btn btn-ghost btn-circle bg-base-100 border border-base-300 hover:bg-base-200 shadow-lg"
        >
          <Home className="w-5 h-5" />
        </Link>
      </div>

      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
