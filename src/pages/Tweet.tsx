import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Download, Share2, Copy, Check, Github } from "lucide-react";

export default function SimpleTweetToFart() {
  const [status, setStatus] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [audioSrc, setAudioSrc] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tweetId, setTweetId] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [previousTweet, setPreviousTweet] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const shouldAutoplayRef = useRef<boolean>(false);

  const extractTweetId = (url: string): string => {
    const matches = url.match(/\/status\/(\d+)/);
    return matches ? matches[1] : "";
  };

  const validateTwitterUrl = (url: string) => {
    if (!url.trim()) {
      return "Please enter a tweet URL";
    }

    try {
      new URL(url);
    } catch {
      return "Please enter a valid URL";
    }

    const twitterPatterns = [
      /^https?:\/\/(www\.)?(twitter|x)\.com\/\w+\/status\/\d+/i,
      /^https?:\/\/(www\.)?x\.com\/\w+\/status\/\d+/i
    ];

    if (!twitterPatterns.some(pattern => pattern.test(url))) {
      return "Please enter a valid Twitter/X tweet URL";
    }

    return "";
  };

  const CONTRACT_ADDRESS = "n/a";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(CONTRACT_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const updateLoadingStatus = () => {
    const steps = [
      "Reading tweet...",
      "Analyzing tweet sentiment...",
      "Generating fart..."
    ];
    
    let currentStep = 0;
    
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setStatus(steps[currentStep]);
        currentStep++;
      }
    }, 1500);

    return () => clearInterval(interval);
  };

  const attemptAutoplay = async () => {
    if (audioRef.current && shouldAutoplayRef.current) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.log("Autoplay prevented:", error);
        setIsPlaying(false);
      }
      shouldAutoplayRef.current = false;
    }
  };

  const extractUsername = (url) => {
    try {
      if (!url.startsWith("http")) {
            url = "https://" + url;
        }
        let pathname = new URL(url).pathname;
        let parts = pathname.split('/');
        return parts[1];
    } catch (error) {
          console.error("Invalid URL:", error);
          return "fart";
    }
  }

  const processTweet = async (tweetUrl?: string) => {
    const urlToProcess = tweetUrl || input;
    const validationError = validateTwitterUrl(urlToProcess);
    
    if (validationError) {
      setError(validationError);
      return;
    }

    const extractedTweetId = extractTweetId(urlToProcess);
    setTweetId(extractedTweetId);
    setPreviousTweet(urlToProcess);

    setError("");
    setAudioSrc("");
    setLoading(true);
    
    const clearInterval = updateLoadingStatus();

    try {
      const response = await fetch('https://api.fartifytweet.fun/tweet2fart', {
        method: 'POST',
        body: JSON.stringify({ text: urlToProcess }),
        headers: { 'Content-Type': 'application/json' }
      });
      
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioSrc(audioUrl);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        shouldAutoplayRef.current = true;
        await audioRef.current.play();
        setIsPlaying(true);
      }

    } catch (error) {
      setStatus("Failed to convert tweet 💨");
      setIsPlaying(false);
    } finally {
      setLoading(false);
      clearInterval();
      setStatus("");
    }
  };

  const togglePlay = async () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.log("Playback failed:", error);
          setIsPlaying(false);
        }
      }
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const handleDownload = () => {
    if (audioSrc) {
      const link = document.createElement('a');
      link.href = audioSrc;
      link.download = `${extractUsername(previousTweet)}_fart.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = () => {
    const tweetText = `Check out the bowl of farts 💨 💨 💨  you tweeted via FartifyTweet: https://fartifytweet.fun?tweet_url=${previousTweet}`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&in_reply_to=${tweetId}`;
    window.open(tweetUrl, '_blank');
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tweetUrl = urlParams.get('tweet_url');

    if (tweetUrl) {
      setInput(tweetUrl);
      processTweet(tweetUrl);
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleAudioEnded);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('ended', handleAudioEnded);
        }
      };
    }
  }, [audioRef.current]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <a
        href="https://github.com/RoyAyo/T2F"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-gray-800/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
      >
        <Github className="w-5 h-5 text-gray-400" />
        <span className="text-gray-400 text-sm">GitHub</span>
      </a>

      <div className="absolute top-4 right-4 z-20">
        <div className="flex items-center gap-2 bg-gray-800/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-700">
          <span className="text-gray-400 text-sm font-mono">
            CA:
            {` n/a`}
          </span>
          <button
            onClick={handleCopy}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
            title={copied ? "Copied!" : "Copy address"}
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <div className="absolute inset-0 opacity-5">
        <div className="absolute w-96 h-96 bg-gray-300 rounded-full blur-3xl animate-pulse -bottom-24 -right-24" />
        <div className="absolute w-96 h-96 bg-gray-300 rounded-full blur-3xl animate-pulse delay-700 -bottom-12 -left-24" />
        <div className="absolute w-64 h-64 bg-gray-300 rounded-full blur-3xl animate-pulse delay-500 top-12 right-12" />
      </div>

      <div className="relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-3 bg-gradient-to-r from-gray-900 via-gray-950 to-gray-950 bg-clip-text text-transparent">
            FartifyTweetAI 💨
          </h1>
          <p className="text-lg text-gray-400">All tweets are just farts in disguise 💨💨</p>
        </div>

        {loading && status && (
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center space-x-3 bg-gray-800/90 backdrop-blur-sm px-8 py-4 rounded-xl shadow-sm">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
              <span className="text-xl text-gray-300">{status}</span>
            </div>
          </div>
        )}

        {audioSrc && (
          <div className="mt-8 mb-6 flex justify-center items-center space-x-4 bg-gray-800/90 backdrop-blur-sm py-4 px-2 rounded-xl">
            <button
              onClick={togglePlay}
              className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-gray-200" />
              ) : (
                <Play className="w-4 h-4 text-gray-200" />
              )}
            </button>
            <div className="text-gray-300 text-lg">
              {isPlaying ? "Farting..." : `Fart is ready...`}
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleDownload}
                className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors flex items-center gap-2"
                title="Download"
              >
                <Download className="w-4 h-4 text-gray-200" />
              </button>
              <button
                onClick={handleShare}
                className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors flex items-center gap-2"
                title="Share"
              >
                <Share2 className="w-4 h-4 text-gray-200" />
              </button>
            </div>
          </div>
        )}

        <div className="w-full max-w-2xl">
          <div className="relative">
            <input
              className="w-full px-8 py-6 text-xl bg-gray-800/90 backdrop-blur-sm border-2 
                         border-gray-700 rounded-xl focus:ring-2 focus:ring-gray-500 
                         focus:border-transparent focus:outline-none transition-shadow 
                         text-center text-gray-200 placeholder-gray-500"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError("");
              }}
              placeholder="Paste tweet URL here..."
              onKeyDown={(e) => e.key === "Enter" && processTweet()}
            />
            {error && (
              <div className="absolute -bottom-7 left-0 right-0 text-center">
                <span className="text-red-400 text-sm">{error}</span>
              </div>
            )}
          </div>
          
          <button
            onClick={() => processTweet()}
            className="w-full mt-10 px-8 py-6 bg-gray-700 text-gray-100 rounded-xl 
                     hover:bg-gray-600 transition-colors text-xl font-medium
                     shadow-lg hover:shadow-xl disabled:opacity-50"
            disabled={!!error || loading}
          >
            Generate Fart
          </button>
        </div>
      </div>

      <audio 
        ref={audioRef} 
        className="hidden" 
        onEnded={handleAudioEnded}
      />
    </div>
  );
}