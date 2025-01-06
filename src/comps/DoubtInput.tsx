import React, { useState, useEffect } from "react";
import { analyzeText } from "../utils/gemini"; // Importing the function to process doubts
import { Volume2, VolumeX } from "lucide-react"; // Icons for speech functionality
import { speak, stopSpeaking } from "../utils/speech"; // Speech utilities

interface DoubtInputProps {
  history: any[];
  setHistory: React.Dispatch<React.SetStateAction<any[]>>;
  theme: "light" | "dark"; // Added theme for dynamic styling
}

export function DoubtInput({ history, setHistory, theme }: DoubtInputProps) {
  const [doubt, setDoubt] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return () => stopSpeaking(); // Stop any speech when the component unmounts
  }, []);

  const handleSubmit = async () => {
    if (!doubt.trim()) return; // Prevent submission of empty doubts
    setLoading(true);
    setAnswer(""); // Clear previous answer while fetching new one

    try {
      const solution = await analyzeText(doubt); // Call Gemini API to process the doubt
      setAnswer(solution);

      // Update history with new doubt and solution
      const newHistoryItem = { question: doubt, solution };
      setHistory([newHistoryItem, ...history]);

      setDoubt(""); // Clear input after submission
    } catch (error) {
      console.error("Error fetching answer:", error);
      setAnswer("Sorry, I encountered an error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      speak(answer, () => setIsSpeaking(false));
      setIsSpeaking(true);
    }
  };

  return (
    <div
      className={`flex flex-col items-center space-y-4 p-4 rounded-lg shadow-md w-full max-w-lg ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <h2 className="text-2xl font-bold">Ask Your Doubts??</h2>
      <textarea
        className={`w-full h-24 p-4 border rounded-lg focus:outline-none ${
          theme === "dark"
            ? "bg-gray-900 text-white border-gray-600"
            : "bg-white text-black border-gray-300"
        }`}
        placeholder="Type your doubt here..."
        value={doubt}
        onChange={(e) => setDoubt(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`px-6 py-2 rounded-lg font-semibold transition-all ${
          theme === "dark"
            ? "bg-blue-500 text-white hover:bg-blue-400"
            : "bg-blue-600 text-white hover:bg-blue-500"
        } disabled:opacity-50`}
      >
        {loading ? "Fetching Answer..." : "Submit"}
      </button>
      {answer && (
        <div
          className={`w-full p-4 border rounded-lg flex flex-col items-start ${
            theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-black"
          }`}
        >
          <div className="flex justify-between items-center w-full mb-2">
            <h3 className="font-semibold">Answer:</h3>
            <button
              onClick={toggleSpeech}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
              aria-label={isSpeaking ? "Stop speaking" : "Start speaking"}
            >
              {isSpeaking ? (
                <VolumeX className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Volume2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
