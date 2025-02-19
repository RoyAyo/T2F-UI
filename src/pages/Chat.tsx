import React, { useState, useEffect, useRef } from "react";
import { Send, Play, Pause, Volume2, Wind, ExternalLink } from "lucide-react";
import { Link, useLocation } from 'react-router-dom';

interface Message {
  type: "text" | "audio";
  sender: "user" | "bot";
  text?: string;
  audioSrc?: string;
  timestamp?: Date;
}

const AudioMessage = ({ 
  audioSrc, 
  isPlaying, 
  onToggle,
  onExport
}: { 
  audioSrc: string; 
  isPlaying: boolean; 
  onToggle: () => void;
  onExport: () => void;
}) => (
  <div className="flex items-center space-x-3 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-sm">
    <button
      onClick={onToggle}
      className="h-10 w-10 flex items-center justify-center rounded-full bg-purple-100 hover:bg-purple-200 transition-colors"
    >
      {isPlaying ? (
        <Pause size={18} className="text-purple-700" />
      ) : (
        <Play size={18} className="text-purple-700 ml-1" />
      )}
    </button>
    <div className="flex flex-col">
      <span className="text-sm font-medium text-gray-700">Audio Response</span>
      <div className="flex items-center space-x-2">
        <Volume2 size={14} className="text-gray-400" />
        <div className="h-1 w-32 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-purple-500 rounded-full transition-all duration-300"
            style={{ width: isPlaying ? "100%" : "0%" }}
          />
        </div>
      </div>
    </div>
    <button
      onClick={onExport}
      className="h-8 w-8 flex items-center justify-center rounded-full bg-purple-100 hover:bg-purple-200 transition-colors"
    >
      <ExternalLink size={16} className="text-purple-700" />
    </button>
  </div>
);

export default function Chatbot() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('message') || '';

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>(initialQuery);
  const [loading, setLoading] = useState<boolean>(false);
  const [playingAudioIndex, setPlayingAudioIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Set HTML and body height
  useEffect(() => {
    document.documentElement.style.height = '100%';
    document.body.style.height = '100%';
    document.body.style.margin = '0';
    
    // Cleanup
    return () => {
      document.documentElement.style.height = '';
      document.body.style.height = '';
      document.body.style.margin = '';
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;
    
    const newMessages: Message[] = [
      ...messages, 
      { 
        text: input, 
        sender: "user", 
        type: "text",
        timestamp: new Date()
      }
    ];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    if(input.length > 100) {
      setMessages(prevMessages => [
        ...prevMessages, 
        { 
          type: "text", 
          sender: "bot",
          text: "Keep your 💨 to 100 characters",
          timestamp: new Date()
        }
      ]);
      setLoading(false);
      return;
    }
    
    fetch('https://api.text2fart.com/fart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: input })
    })
    .then(response => {
      if (!response.ok) {
        return response.text().then(errorText => {
          throw new Error(errorText || 'Bot unavailable');
        });
      }
      return response.blob();
    })
    .then(audioBlob => {
      setMessages(prevMessages => [
        ...prevMessages, 
        { 
          type: "audio", 
          sender: "bot", 
          audioSrc: URL.createObjectURL(audioBlob),
          timestamp: new Date()
        }
      ]);
      setLoading(false);
    })
    .catch(error => {
      setMessages(prevMessages => [
        ...prevMessages, 
        { 
          type: "text", 
          sender: "bot",
          text: "💨 Unable to convert Fart",
          timestamp: new Date()
        }
      ]);
      setLoading(false);
    });
  };

  const toggleAudio = (audioSrc: string, index: number) => {
    if (audioRef.current) {
      if (playingAudioIndex === index) {
        audioRef.current.pause();
        setPlayingAudioIndex(null);
        return;
      } else {
        audioRef.current.pause();
        audioRef.current = null;
      }
    }
    const audio = new Audio(audioSrc);
    audioRef.current = audio;
    audio.play();
    setPlayingAudioIndex(index);
    audio.onended = () => setPlayingAudioIndex(null);
  };

  const exportAudio = (audioSrc: string) => {
    window.open(audioSrc, '_blank');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="flex-none px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-4">
          <Link to="/">
            <div className="flex justify-center">
              <Wind className="h-12 w-12 text-purple-500 animate-bounce" />
            </div>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">F 💨</h1>
            <p className="text-sm text-gray-500">Send a text, receive your fart</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === "bot" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-md ${
                msg.sender === "bot"
                  ? "mr-auto"
                  : "ml-auto"
              }`}
            >
              {msg.type === "text" ? (
                <div className="bg-white px-4 py-3 rounded-2xl shadow-sm">
                  <p className="text-gray-800">{msg.text}</p>
                  <span className="text-xs text-gray-400 mt-1 block">
                    {msg.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ) : (
                <AudioMessage
                  audioSrc={msg.audioSrc!}
                  isPlaying={playingAudioIndex === index}
                  onToggle={() => toggleAudio(msg.audioSrc!, index)}
                  onExport={() => exportAudio(msg.audioSrc!)}
                />
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-3 rounded-2xl shadow-sm">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex-none p-6 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-4">
          <input
            className="flex-1 px-4 py-3 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none transition-shadow"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className="p-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
            onClick={sendMessage}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}