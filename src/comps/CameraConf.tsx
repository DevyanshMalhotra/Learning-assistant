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
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-900">
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="w-full h-full object-contain"
          videoConstraints={WEBCAM_CONFIG}
        />
        <button
          onClick={capture}
          disabled={isAnalyzing}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <CameraIcon className="w-5 h-5" />
              Capture & Solve
            </>
          )}
        </button>
      </div>

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
