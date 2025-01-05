import React, { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Camera as CameraIcon, Loader2 } from "lucide-react";
import { analyzeImage } from "../utils/gemini";
import { Solution } from "./SolutionGen";

const WEBCAM_CONFIG = {
  width: 1280,
  height: 720,
  facingMode: "environment",
  screenshotQuality: 0.92,
};

export function Camera({
  activeMode,
  setActiveMode,
}: {
  activeMode: string;
  setActiveMode: (mode: string) => void;
}) {
  const webcamRef = useRef<Webcam>(null);
  const [solution, setSolution] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const capture = useCallback(async () => {
    setError("");
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) {
      setError("Failed to capture image. Please try again.");
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeImage(imageSrc);
      setSolution(result);
    } catch (err) {
      setError("Failed to analyze image. Please try again.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [webcamRef]);

  if (activeMode !== "image") return null;

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Capture & Solve Your Problem</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Use your camera to capture problems, and let our AI solve them instantly!
        </p>
      </div>

      <div className="relative w-full h-screen max-h-[500px] overflow-hidden bg-gray-900 shadow-lg rounded-lg">
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="w-full h-full object-cover"
          videoConstraints={WEBCAM_CONFIG}
        />
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={capture}
          disabled={isAnalyzing}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-full shadow-lg transform transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CameraIcon className="w-5 h-5" />
              Capture & Solve
            </div>
          )}
        </button>
      </div>

      {error && (
        <div className="w-full bg-red-50 border border-red-200 rounded-lg p-4 shadow-md">
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
