import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import ImagePreview from "./ImagePreview";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const fileInputRef = useRef(null);
  const { sendMessage, isSendingMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImagePreview = () => {
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
  };
  const handleSendMessage = async (e) => {
    e.preventDefault();

    // Prevent sending if already sending or no content
    if (isSendingMessage || (!text.trim() && !imagePreview)) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full">      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleImagePreview}
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        {" "}
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className={`w-full input input-bordered rounded-lg input-sm sm:input-md ${
              isSendingMessage ? "opacity-50 cursor-not-allowed" : ""
            }`}
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isSendingMessage}
          />
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}
                     ${isSendingMessage ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => fileInputRef.current?.click()}
            disabled={isSendingMessage}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className={`btn btn-sm btn-circle ${isSendingMessage ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={isSendingMessage || (!text.trim() && !imagePreview)}
        >
          {isSendingMessage ? <div className="loading loading-spinner loading-xs"></div> : <Send size={22} />}        </button>
      </form>
      
      {/* Image Preview Modal */}
      <ImagePreview 
        imageUrl={imagePreview}
        isOpen={isPreviewOpen}
        onClose={closePreview}
      />
    </div>
  );
};
export default MessageInput;
