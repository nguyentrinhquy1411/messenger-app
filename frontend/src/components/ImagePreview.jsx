import { X } from "lucide-react";

const ImagePreview = ({ imageUrl, isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="relative max-w-3xl max-h-[85vh] w-full px-4">
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors z-10 shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <img
          src={imageUrl}
          alt="Preview"
          className="w-full h-full max-w-full max-h-full object-contain rounded-lg shadow-xl"
        />
      </div>
    </div>
  );
};

export default ImagePreview;
