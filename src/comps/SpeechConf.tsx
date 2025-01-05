import React, { useState, useEffect } from "react";
import { analyzeText } from "../utils/gemini";
import { Solution } from "./SolutionGen";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

export function SpeechInput({
  activeMode,
  setActiveMode,
}: {
  activeMode: string;
  setActiveMode: (mode: string) => void;
}) {
  const [solution, setSolution] = useState<string>("");
  const [language, setLanguage] = useState<string>("en-US"); // Default language
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string>("");
  const [isListening, setIsListening] = useState(false);

  const recognition = React.useMemo(() => {
    if (SpeechRecognition) {
      const instance = new SpeechRecognition();
      instance.continuous = false;
      instance.interimResults = false;
      instance.lang = language;
      return instance;
    }
    return null;
  }, [language]);

  const handleSpeechInput = async () => {
    if (!recognition) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    setIsListening(true);
    setError("");
    setSolution("");

    recognition.start();

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const speechResult = event.results[0][0].transcript;
      setIsListening(false);

      try {
        const result = await analyzeText(speechResult);
        setSolution(result);
      } catch (err) {
        setError("Failed to process speech input. Please try again.");
        console.error(err);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setIsListening(false);
      setError(`Error during speech recognition: ${event.error}`);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  useEffect(() => {
    return () => {
      stopListening(); // Clean up on component unmount
    };
  }, [recognition]);

  if (activeMode !== "speech") return null;

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <label htmlFor="language" className="text-gray-700 dark:text-gray-200">
          Select Language:
        </label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="p-2 rounded border border-gray-300 dark:border-gray-700"
        >
          <option value="en-US">English</option>
          <option value="hi-IN">Hindi</option>
          <option value="ta-IN">Tamil</option>
          {/* Add more languages as needed */}
        </select>
      </div>

      <button
        onClick={isListening ? stopListening : handleSpeechInput}
        className={`px-6 py-3 rounded-full text-white ${
          isListening
            ? "bg-red-600 hover:bg-red-700"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {isListening ? "Stop Listening" : "Start Speech Input"}
      </button>

      {error && (
        <div className="w-full bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {solution && !error && (
        <Solution
          solution={solution}
          isSpeaking={isSpeaking}
          onToggleSpeech={setIsSpeaking}
        />
      )}
    </div>
  );
}
