import React, { useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { speak, stopSpeaking } from "../utils/speech";

interface SolutionProps {
  solution: string;
  onToggleSpeech: (speaking: boolean) => void;
  isSpeaking: boolean;
}

export function Solution({ solution, onToggleSpeech, isSpeaking }: SolutionProps) {
  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
      onToggleSpeech(false);
    } else {
      speak(solution, () => onToggleSpeech(false));
      onToggleSpeech(true);
    }
  };

  // Convert the Markdown-style text to plain text
  const plainTextSolution = solution
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold (**text**)
    .replace(/\*(.*?)\*/g, '$1') // Remove italic (*text*)
    .replace(/^\s*[\*\-]\s+/gm, '- ') // Replace bullet points (*) with plain dash (-)
    .replace(/\n{2,}/g, '\n') // Remove excessive newlines

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold dark:text-white">Solution:</h2>
        <button
          onClick={handleToggleSpeech}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          aria-label={isSpeaking ? "Stop speaking" : "Start speaking"}
        >
          {isSpeaking ? (
            <VolumeX className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <Volume2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          )}
        </button>
      </div>
      <div className="prose dark:prose-invert max-w-none">
        {plainTextSolution.split('\n').map((line, i) => (
          <p key={i} className="mb-2 dark:text-gray-300">{line}</p>
        ))}
      </div>
    </div>
  );
}