import { useState } from "react";
import { Bell, Heart, MessageCircle, Share, UserPlus, X } from "lucide-react";

const NotificationDropdown = ({ isOpen, onClose }) => {
  const [notifications] = useState([
    {
      id: 1,
      type: "like",
      user: {
        name: "Sarah Wilson",
        avatar: "/avatar.png",
        username: "@sarahw",
      },
      content: "liked your post",
      time: "2m ago",
      isRead: false,
      postPreview: "Just finished working on a new project!",
    },
    {
      id: 2,
      type: "comment",
      user: {
        name: "Mike Chen",
        avatar: "/avatar.png",
        username: "@mikechen",
      },
      content: "commented on your post",
      time: "5m ago",
      isRead: false,
      comment: "Great work! Looking forward to see more.",
      postPreview: "Beautiful sunset today!",
    },
    {
      id: 3,
      type: "repost",
      user: {
        name: "Emily Davis",
        avatar: "/avatar.png",
        username: "@emilyd",
      },
      content: "reposted your post",
      time: "1h ago",
      isRead: true,
      postPreview: "Working on some exciting features",
    },
    {
      id: 4,
      type: "follow",
      user: {
        name: "Alex Johnson",
        avatar: "/avatar.png",
        username: "@alexj",
      },
      content: "started following you",
      time: "2h ago",
      isRead: true,
    },
  ]);
  const getNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return <Heart className="w-3 h-3 text-red-500" fill="currentColor" />;
      case "comment":
        return <MessageCircle className="w-3 h-3 text-blue-500" />;
      case "repost":
        return <Share className="w-3 h-3 text-green-500" />;
      case "follow":
        return <UserPlus className="w-3 h-3 text-purple-500" />;
      default:
        return <Bell className="w-3 h-3 text-base-content/60" />;
    }
  };
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-20 z-40"
        onClick={onClose}
      ></div>

      {/* Notification Panel - Left Side */}
      <div className="fixed top-0 left-0 w-80 h-full bg-base-100 border-r border-base-300 shadow-xl z-50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-base-300">
          <h3 className="font-semibold text-base-content">Notifications</h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="h-full overflow-y-auto pb-4">
          {notifications.length === 0 ? (
            <div className="p-6 text-center">
              <Bell className="w-8 h-8 text-base-content/30 mx-auto mb-2" />
              <p className="text-base-content/60 text-sm">No notifications</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 border-b border-base-300 hover:bg-base-200/50 cursor-pointer ${
                  !notification.isRead ? "bg-primary/5" : ""
                }`}
              >
                <div className="flex items-start space-x-3">
                  <img
                    src={notification.user.avatar}
                    alt={notification.user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1">
                      {getNotificationIcon(notification.type)}
                      <p className="text-sm">
                        <span className="font-medium text-base-content">
                          {notification.user.name}
                        </span>
                        <span className="text-base-content/70 ml-1">
                          {notification.content}
                        </span>
                      </p>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </div>
                    <span className="text-base-content/50 text-xs">
                      {notification.time}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationDropdown;
