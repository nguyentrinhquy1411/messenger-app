import MainNavBar from "./MainNavBar";
import RightSidebar from "./RightSidebar";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Search, MessageCircle, User } from "lucide-react";

const MainLayout = ({
  children,
  compactNavbar = false,
  hideRightSidebar = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const mobileNavItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: MessageCircle, label: "Messages", path: "/messages" },
    { icon: User, label: "Profile", path: "/profile" },
  ];
  return (
    <div className="min-h-screen bg-base-200 flex">
      {" "}
      {/* Left Navbar - Hidden on mobile */}
      <div className="hidden lg:block">
        <MainNavBar compact={compactNavbar} />
      </div>{" "}
      {/* Main Content */}
      <div
        className={`flex-1 ${compactNavbar ? "lg:ml-20" : "lg:ml-64"} ${
          hideRightSidebar ? "" : "xl:mr-96"
        }`}
      >
        <main className="max-w-2xl mx-auto py-8 px-4">{children}</main>
      </div>{" "}
      {/* Right Sidebar - Hidden on mobile and tablet, conditionally rendered */}
      {!hideRightSidebar && (
        <div className="hidden xl:block fixed right-0 top-0 h-full">
          <RightSidebar />
        </div>
      )}{" "}
      {/* Mobile Navigation - Bottom */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-base-100 border-t border-base-300 z-50">
        <div className="flex justify-around py-2">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                  active
                    ? "text-primary bg-primary/10"
                    : "text-base-content/70 hover:text-base-content hover:bg-base-200"
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      {/* Add bottom padding for mobile to prevent content from being hidden behind mobile nav */}
      <div className="lg:hidden h-20"></div>
    </div>
  );
};

export default MainLayout;
