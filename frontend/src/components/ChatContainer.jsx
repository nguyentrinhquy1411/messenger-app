import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import ImagePreview from "./ImagePreview";
import { formatMessageTime } from "../lib/utils";
import { useAuthStore } from "../store/useAuthStore";

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages } =
    useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  
  // Image preview state
  const [previewImage, setPreviewImage] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleImageClick = (imageUrl) => {
    setPreviewImage(imageUrl);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setPreviewImage(null);
  };

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">{formatMessageTime(message.createdAt)}</time>
            </div>            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img 
                  src={message.image} 
                  alt="Attachment" 
                  className="sm:max-w-[200px] rounded-md mb-2 cursor-pointer hover:opacity-80 transition-opacity" 
                  onClick={() => handleImageClick(message.image)}
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}      </div>

      <MessageInput />
      
      {/* Image Preview Modal */}
      <ImagePreview 
        imageUrl={previewImage}
        isOpen={isPreviewOpen}
        onClose={closePreview}
      />
    </div>
  );
};
export default ChatContainer;
