import {
  Home,
  Search,
  MessageSquare,
  User,
  Settings,
  Bell,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import NotificationDropdown from "./NotificationDropdown";

const MainNavBar = ({ compact = false }) => {
  const { authUser, logout } = useAuthStore();
  const location = useLocation();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const navItems = [
    { id: "home", icon: Home, label: "Home", path: "/" },
    { id: "search", icon: Search, label: "Search", path: "/search" },
    {
      id: "messages",
      icon: MessageSquare,
      label: "Messages",
      path: "/messages",
    },
    { id: "profile", icon: User, label: "Profile", path: "/profile" },
    { id: "settings", icon: Settings, label: "Settings", path: "/settings" },
  ];

  if (compact) {
    return (
      <>
        <nav className="fixed left-0 top-0 h-full w-20 bg-base-100 border-r border-base-300 p-4 z-40 flex flex-col">
          {/* Compact Logo */}
          <div className="mb-8 flex justify-center">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary-content" />
            </div>
          </div>{" "}
          {/* Compact Navigation */}
          <div className="space-y-4 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <div
                  key={item.id}
                  className="tooltip tooltip-right"
                  data-tip={item.label}
                >
                  <Link
                    to={item.path}
                    className={`w-12 h-12 flex items-center justify-center rounded-lg transition-colors ${
                      isActive
                        ? "bg-base-200 text-base-content"
                        : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                    }`}
                  >
                    <Icon size={20} />
                  </Link>
                </div>
              );
            })}
          </div>{" "}
          {/* Compact Notifications */}
          <div className="mb-4">
            <div className="tooltip tooltip-right" data-tip="Notifications">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className={`w-12 h-12 flex items-center justify-center rounded-lg transition-colors relative ${
                  isNotificationOpen
                    ? "bg-primary text-primary-content"
                    : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                }`}
              >
                <Bell size={20} />
                {hasUnreadNotifications && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                )}
              </button>
            </div>
          </div>
          {/* Compact User Profile */}
          <div className="mt-auto">
            <div
              className="tooltip tooltip-right"
              data-tip={authUser?.fullName || "Profile"}
            >
              <div className="w-12 h-12 flex items-center justify-center">
                <img
                  src={authUser?.profilePic || "/avatar.png"}
                  alt={authUser?.fullName || "User"}
                  className="w-10 h-10 rounded-full object-cover border-2 border-base-300"
                />
              </div>{" "}
            </div>
          </div>
        </nav>

        {/* Notification Dropdown - Outside of nav */}
        {isNotificationOpen && (
          <NotificationDropdown
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <nav className="fixed left-0 top-0 h-full w-64 bg-base-100 border-r border-base-300 p-6 z-40">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-base-content">Chatty</h1>
        </div>{" "}
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.id}
                to={item.path}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-base-200 text-base-content"
                    : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                }`}
              >
                <Icon size={24} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}{" "}
          {/* Full Notifications */}
          <button
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors relative ${
              isNotificationOpen
                ? "bg-primary text-primary-content"
                : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
            }`}
          >
            <Bell size={24} />
            <span className="font-medium">Notifications</span>
            {hasUnreadNotifications && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">3</span>
              </div>
            )}
          </button>
        </div>        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center space-x-3 p-3 bg-base-200 rounded-lg">
            <img
              src={authUser?.profilePic || "/avatar.png"}
              alt={authUser?.fullName}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-base-content truncate">
                {authUser?.fullName}
              </p>
              <p className="text-sm text-base-content/70 truncate">
                {authUser?.email}
              </p>
            </div>            <button
              onClick={handleLogout}
              className="p-2 hover:bg-base-300 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={18} className="text-base-content/70" />
            </button>
          </div>
        </div>
      </nav>      {/* Notification Dropdown - Outside of nav */}
      {isNotificationOpen && (
        <NotificationDropdown
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
        />
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
            <p className="text-base-content/70 mb-6">
              Are you sure you want to logout?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={cancelLogout}
                className="flex-1 btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 btn btn-error"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MainNavBar;
