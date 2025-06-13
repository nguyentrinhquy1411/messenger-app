import { useState } from "react";
import { X, Image, Smile } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import EmojiPicker from "emoji-picker-react";

const CreatePostModal = ({ isOpen, onClose, onCreatePost }) => {
  const [postText, setPostText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const { authUser } = useAuthStore();
  const handleEmojiClick = (emojiData) => {
    setPostText((prev) => prev + emojiData.emoji);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImages((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            url: event.target.result,
            file: file,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id) => {
    setSelectedImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!postText.trim() && selectedImages.length === 0) return;
    const newPost = {
      id: Date.now(),
      user: {
        name: authUser?.fullName || "User",
        avatar: authUser?.profilePic || "/avatar.png",
        username: "@" + (authUser?.username || "user"),
        verified: false,
      },
      content: postText,
      image: selectedImages.length > 0 ? selectedImages[0].url : null,
      timestamp: "now",
      likes: 0,
      replies: 0,
      isLiked: false,
    };

    onCreatePost(newPost);
    setPostText("");
    setSelectedImages([]);
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-xl w-full max-w-lg max-h-[85vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-base-300">
          <h2 className="text-lg font-semibold text-base-content">
            Create Post
          </h2>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle hover:bg-base-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>{" "}
        {/* Content */}
        <div className="p-6">
          {/* User Info */}
          <div className="flex items-center space-x-3 mb-4">
            <img
              src={authUser?.profilePic || "/avatar.png"}
              alt={authUser?.fullName}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="font-medium text-base-content text-base">
                {authUser?.fullName || "User"}
              </h3>
            </div>
          </div>

          {/* Post Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {" "}
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder={`What's on your mind, ${
                authUser?.fullName?.split(" ")[0] || "User"
              }?`}
              className="textarea textarea-ghost w-full min-h-[120px] text-base resize-none border-none focus:outline-none p-0"
              autoFocus
            />{" "}
            {/* Selected Images */}
            {selectedImages.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-4">
                {selectedImages.map((image) => (
                  <div key={image.id} className="relative">
                    <img
                      src={image.url}
                      alt="Selected"
                      className="w-full h-28 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="absolute top-2 right-2 btn btn-ghost btn-xs btn-circle bg-black bg-opacity-60 text-white hover:bg-opacity-80"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="mt-3 bg-base-200 rounded-lg p-2">
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  width="100%"
                  height={300}
                  searchDisabled
                  skinTonesDisabled
                  previewConfig={{
                    showPreview: false,
                  }}
                  theme="auto"
                  style={{
                    backgroundColor: "transparent",
                  }}
                />
              </div>
            )}{" "}
            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-base-300">
              <div className="flex items-center gap-3">
                <label
                  className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-base-200 cursor-pointer transition-colors tooltip"
                  data-tip="Add Photo"
                >
                  <Image className="w-5 h-5 text-green-500" />
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={`flex items-center justify-center w-10 h-10 rounded-full hover:bg-base-200 transition-colors tooltip ${
                    showEmojiPicker ? "bg-base-300" : ""
                  }`}
                  data-tip="Add Emoji"
                >
                  <Smile className="w-5 h-5 text-yellow-500" />
                </button>
              </div>

              <button
                type="submit"
                disabled={!postText.trim() && selectedImages.length === 0}
                className="btn btn-primary btn-sm h-10 px-6 rounded-full disabled:opacity-50"
              >
                Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
