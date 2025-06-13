import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Users, Filter } from "lucide-react";

const CompactSidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) {
    return (
      <aside className="h-full w-20 border-r border-base-300 flex flex-col">
        <div className="flex items-center justify-center p-5 border-b border-base-300">
          <Users className="size-6" />
        </div>
        <div className="flex-1 p-2">
          <div className="animate-pulse space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-12 h-12 bg-base-300 rounded-full mx-auto"
              ></div>
            ))}
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="h-full w-20 border-r border-base-300 flex flex-col bg-base-100">
      {/* Header with icon only */}
      <div className="border-b border-base-300 p-5 flex flex-col items-center gap-3">
        <Users className="size-6 text-base-content" />

        {/* Compact filter toggle */}
        <div
          className="tooltip tooltip-right"
          data-tip={showOnlineOnly ? "Show all" : "Show online only"}
        >
          <button
            onClick={() => setShowOnlineOnly(!showOnlineOnly)}
            className={`btn btn-ghost btn-sm btn-circle ${
              showOnlineOnly ? "bg-primary text-primary-content" : ""
            }`}
          >
            <Filter className="size-4" />
          </button>
        </div>

        {/* Online count */}
        <div className="text-xs text-base-content/60 text-center">
          {onlineUsers?.length - 1}
        </div>
      </div>

      {/* User list - icons only */}
      <div className="overflow-y-auto flex-1 py-3">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="tooltip tooltip-right"
            data-tip={user.fullName}
          >
            <button
              onClick={() => setSelectedUser(user)}
              className={`
                w-full p-3 flex items-center justify-center
                hover:bg-base-300 transition-colors
                ${
                  selectedUser?._id === user._id
                    ? "bg-base-300 ring-1 ring-primary"
                    : ""
                }
              `}
            >
              <div className="relative">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.name}
                  className="size-12 object-cover rounded-full"
                />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-base-100" />
                )}
              </div>
            </button>
          </div>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-base-content/60 py-4 text-xs">
            No users
          </div>
        )}
      </div>
    </aside>
  );
};

export default CompactSidebar;
