import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { Send } from "lucide-react";
import ThreadsLayout from "../components/ThreadsLayout";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  {
    id: 2,
    content: "I'm doing great! Just working on some new features.",
    isSent: true,
  },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <ThreadsLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
            <p className="mt-2 text-gray-600">Customize your app preferences</p>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold text-gray-900">Theme</h2>
              <p className="text-sm text-gray-600">
                Choose a theme for your chat interface
              </p>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {THEMES.map((t) => (
                <button
                  key={t}
                  className={`
                    group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors
                    ${
                      theme === t
                        ? "bg-gray-100 border-2 border-gray-300"
                        : "hover:bg-gray-50 border-2 border-transparent"
                    }
                  `}
                  onClick={() => setTheme(t)}
                >
                  <div
                    className="relative h-8 w-full rounded-md overflow-hidden"
                    data-theme={t}
                  >
                    <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                      <div className="rounded bg-primary"></div>
                      <div className="rounded bg-secondary"></div>
                      <div className="rounded bg-accent"></div>
                      <div className="rounded bg-neutral"></div>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium truncate w-full text-center text-gray-700">
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </span>
                </button>
              ))}
            </div>

            {/* Preview Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
              <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
                <div className="p-4 bg-gray-50">
                  <div className="max-w-lg mx-auto">
                    {/* Mock Chat UI */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                      {/* Chat Header */}
                      <div className="px-4 py-3 border-b border-gray-200 bg-white">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white font-medium">
                            J
                          </div>
                          <div>
                            <h3 className="font-medium text-sm text-gray-900">
                              John Doe
                            </h3>
                            <p className="text-xs text-gray-500">Online</p>
                          </div>
                        </div>
                      </div>

                      {/* Chat Messages */}
                      <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-white">
                        {PREVIEW_MESSAGES.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${
                              message.isSent ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`
                                max-w-[80%] rounded-xl p-3 shadow-sm
                                ${
                                  message.isSent
                                    ? "bg-black text-white"
                                    : "bg-gray-100 text-gray-900"
                                }
                              `}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p
                                className={`
                                  text-[10px] mt-1.5
                                  ${
                                    message.isSent
                                      ? "text-gray-300"
                                      : "text-gray-500"
                                  }
                                `}
                              >
                                12:00 PM
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Chat Input */}
                      <div className="p-4 border-t border-gray-200 bg-white">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            placeholder="Type a message..."
                            value="This is a preview"
                            readOnly
                          />
                          <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                            <Send size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThreadsLayout>
  );
};

export default SettingsPage;
