import { useState } from "react";

const RightSidebar = () => {
  const [suggestedUsers, setSuggestedUsers] = useState([
    {
      id: 1,
      name: "Sarah Wilson",
      username: "sarahw",
      avatar: "/avatar.png",
      isFriend: false,
      mutualFriends: 5,
    },
    {
      id: 2,
      name: "Mike Chen",
      username: "mikechen",
      avatar: "/avatar.png",
      isFriend: false,
      mutualFriends: 12,
    },
    {
      id: 3,
      name: "Emily Davis",
      username: "emilyd",
      avatar: "/avatar.png",
      isFriend: false,
      mutualFriends: 8,
    },
    {
      id: 4,
      name: "David Brown",
      username: "davidb",
      avatar: "/avatar.png",
      isFriend: false,
      mutualFriends: 3,
    },
    {
      id: 5,
      name: "Lisa Park",
      username: "lisapark",
      avatar: "/avatar.png",
      isFriend: false,
      mutualFriends: 7,
    },
  ]);

  const handleAddFriend = (userId) => {
    setSuggestedUsers((users) =>
      users.map((user) =>
        user.id === userId ? { ...user, isFriend: !user.isFriend } : user
      )
    );
  };

  return (
    <div className="w-96 h-full p-4 space-y-4 bg-base-200 border-l border-base-300">
      {/* Suggested for you */}
      <div className="bg-base-100 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-base-content text-lg">
            Suggested for you
          </h3>
          <button className="text-sm text-primary hover:text-primary-focus transition-colors font-medium">
            See All
          </button>
        </div>

        <div className="space-y-2">
          {suggestedUsers.slice(0, 4).map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-2 hover:bg-base-200 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-base-300"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-base-content text-sm truncate">
                    {user.name}
                  </h4>
                  <p className="text-base-content/70 text-xs">
                    @{user.username}
                  </p>
                  <p className="text-base-content/60 text-xs">
                    {user.mutualFriends} mutual friends
                  </p>
                </div>
              </div>{" "}
              <button
                onClick={() => handleAddFriend(user.id)}
                className={`btn btn-sm ml-2 shrink-0 ${
                  user.isFriend ? "btn-outline btn-success" : "btn-primary"
                }`}
              >
                {user.isFriend ? "Friends" : "Add Friend"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
