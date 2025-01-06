import React, { useState } from "react";
import { Solution } from "./SolutionGen"; // Ensure correct path for Solution component

export function HistoryView({ history }: { history: any[] }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);


  const toggleExpansion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">History</h2>
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        {history.map((entry, index) => (
          <div key={index} className="border-b border-gray-200 dark:border-gray-700 mb-4 pb-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleExpansion(index)}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {entry.question}
              </h3>
              <span className="text-gray-600 dark:text-gray-400">
                {expandedIndex === index ? "Collapse" : "Expand"}
              </span>
            </div>
            {expandedIndex === index && (
              <div className="mt-4">
                <Solution solution={entry.solution} isSpeaking={isSpeaking} onToggleSpeech={setIsSpeaking} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
