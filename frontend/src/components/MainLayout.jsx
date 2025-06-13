import MainNavBar from "./MainNavBar";
import RightSidebar from "./RightSidebar";

const MainLayout = ({
  children,
  compactNavbar = false,
  hideRightSidebar = false,
}) => {
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
      )}
      {/* Mobile Navigation - Bottom */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-base-100 border-t border-base-300 p-4">
        <div className="flex justify-around">
          <button className="flex flex-col items-center space-y-1">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="text-xs">Home</span>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span className="text-xs">Search</span>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="text-xs">Messages</span>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
