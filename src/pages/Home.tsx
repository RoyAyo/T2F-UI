import React, { useState } from "react";
import { Send, Volume2, Wind } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Navigate to the chat page with the initial message as a parameter
      navigate(`/chat?message=${encodeURIComponent(message)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-pink-50 to-purple-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Wind className="h-16 w-16 text-purple-500 animate-bounce" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-purple-800 mb-4">
            Text2Fart
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Turn your boring messages into magnificent farts! 💨
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <div className="flex items-center bg-purple-100 rounded-full px-4 py-2">
              <Volume2 className="text-purple-500 mr-2" />
              <span className="text-purple-700">Generate Unique Fart Sounds</span>
            </div>
          </div>
        </div>

        {/* Demo Section */}
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type anything..."
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-purple-200 focus:outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="absolute right-2 top-2 bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600 transition-colors disabled:bg-purple-300 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-purple-800 mb-2">Real-time Processing</h3>
            <p className="text-gray-600">Instant text-to-fart conversion</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-purple-800 mb-2">High Quality</h3>
            <p className="text-gray-600">HD fart sounds for maximum impact</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-purple-800 mb-2">AI-Powered</h3>
            <p className="text-gray-600">Each fart matches your text perfectly</p>
          </div>
        </div>
      </div>
    </div>
  );
}