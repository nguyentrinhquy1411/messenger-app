import { useState } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import MainLayout from "../components/MainLayout";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches] = useState([
    { id: 1, query: "web development", type: "hashtag" },
    { id: 2, query: "john doe", type: "user" },
    { id: 3, query: "react tips", type: "hashtag" },
  ]);

  const [suggestedUsers] = useState([
    {
      id: 1,
      name: "Sarah Wilson",
      username: "@sarahw",
      avatar: "/avatar.png",
      bio: "Frontend Developer | React enthusiast",
      followers: "2.1k",
    },
    {
      id: 2,
      name: "Mike Chen",
      username: "@mikechen",
      avatar: "/avatar.png",
      bio: "Full Stack Developer | Building cool stuff",
      followers: "1.8k",
    },
    {
      id: 3,
      name: "Emily Davis",
      username: "@emilyd",
      avatar: "/avatar.png",
      bio: "UI/UX Designer | Creating beautiful experiences",
      followers: "3.2k",
    },
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Simulate search logic here
    console.log("Searching for:", searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };
  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        {" "}
        {/* Search Header */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="relative">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/60 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for people and posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered w-full pl-12 pr-12 text-lg"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-base-content/60 hover:text-base-content"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </form>
        </div>
        {/* Search Results or Default Content */}{" "}
        {searchQuery ? (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-base-content">
              Search Results
            </h2>
            <div className="text-center py-12">
              <SearchIcon className="w-12 h-12 text-base-content/30 mx-auto mb-4" />
              <p className="text-base-content/70">
                No results found for "{searchQuery}"
              </p>
              <p className="text-base-content/60 text-sm mt-2">
                Try searching for something else
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Recent Searches */}
            <div>
              <h2 className="text-xl font-semibold text-base-content mb-4">
                Recent
              </h2>
              <div className="space-y-3">
                {recentSearches.map((search) => (
                  <div
                    key={search.id}
                    className="flex items-center justify-between p-3 bg-base-100 rounded-lg border border-base-300 hover:bg-base-200 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <SearchIcon className="w-5 h-5 text-base-content/60" />
                      <span className="text-base-content">{search.query}</span>
                      <span className="badge badge-sm">{search.type}</span>
                    </div>
                    <button className="text-base-content/60 hover:text-base-content">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>{" "}
            {/* Suggested People */}
            <div>
              <h2 className="text-xl font-semibold text-base-content mb-4">
                Suggested for you
              </h2>
              <div className="space-y-4">
                {suggestedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="p-4 bg-base-100 rounded-lg border border-base-300 hover:border-base-content/20 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-base-content">
                            {user.name}
                          </h3>
                          <p className="text-base-content/70 text-sm">
                            {user.username}
                          </p>
                          <p className="text-base-content/80 text-sm mt-1">
                            {user.bio}
                          </p>
                          <p className="text-base-content/60 text-xs mt-2">
                            {user.followers} followers
                          </p>
                        </div>
                      </div>
                      <button className="btn btn-primary btn-sm">Follow</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>{" "}
            {/* Trending Topics */}
            <div>
              <h2 className="text-xl font-semibold text-base-content mb-4">
                Trending
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { topic: "#WebDevelopment", posts: "2.1k posts" },
                  { topic: "#JavaScript", posts: "1.8k posts" },
                  { topic: "#React", posts: "1.5k posts" },
                  { topic: "#TailwindCSS", posts: "892 posts" },
                ].map((trend, index) => (
                  <div
                    key={index}
                    className="p-4 bg-base-100 rounded-lg border border-base-300 hover:border-base-content/20 cursor-pointer transition-colors"
                  >
                    <h3 className="font-semibold text-base-content">
                      {trend.topic}
                    </h3>
                    <p className="text-base-content/70 text-sm">
                      {trend.posts}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SearchPage;
