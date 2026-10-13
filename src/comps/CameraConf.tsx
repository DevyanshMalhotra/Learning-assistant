import { useCallback, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import Webcam from 'react-webcam';
import { AlertCircle, Camera as CameraIcon, Image as ImageIcon, Loader2 } from 'lucide-react';
import { analyzeImage } from '../utils/gemini';
import { Solution } from './SolutionGen';
import type { HistoryEntry } from '../types';

interface Props {
  setHistory: Dispatch<SetStateAction<HistoryEntry[]>>;
}

const videoConstraints = { facingMode: 'environment' };

export function Camera({ setHistory }: Props) {
  const webcamRef = useRef<Webcam>(null);
  const [solution, setSolution] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  const capture = useCallback(async () => {
    setError('');
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) {
      setError('The camera is not ready. Please allow camera access and try again.');
      return;
    }

    setIsAnalyzing(true);
    setSolution('');
    try {
      const result = await analyzeImage(imageSrc);
      if (result.title === 'Error') {
        setError(result.solution);
        return;
      }
      setSolution(result.solution);
      setHistory(previous => [{
        type: 'image', question: result.title, solution: result.solution,
      }, ...previous]);
    } catch {
      setError('Could not analyze the captured image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [setHistory]);

  return (
    <div className="mx-auto w-full max-w-[980px] space-y-5 sm:space-y-6">
      <section className="content-card overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b px-5 py-5 sm:px-7" style={{ borderColor: 'var(--border)' }}>
          <div>
            <p className="section-label mb-2">Camera input</p>
            <h2 className="text-lg font-bold sm:text-xl">Capture your question</h2>
            <p className="body-muted mt-1 text-sm">Position the problem inside the frame, then capture it.</p>
          </div>
          <span className="soft-panel flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium">
            <ImageIcon size={15} /> Live camera
          </span>
        </div>

        <div className="p-4 sm:p-6 lg:p-7">
          <div className="relative mx-auto aspect-[4/3] max-h-[500px] w-full overflow-hidden rounded-2xl bg-slate-900 sm:aspect-video">
            <Webcam
              ref={webcamRef}
              audio={false}
              mirrored={false}
              screenshotFormat="image/jpeg"
              screenshotQuality={0.9}
              videoConstraints={videoConstraints}
              className="absolute inset-0 h-full w-full object-cover"
              onUserMedia={() => { setCameraReady(true); setError(''); }}
              onUserMediaError={() => { setCameraReady(false); setError('Unable to access the camera. Check your browser permissions and device.'); }}
            />
            <div className="pointer-events-none absolute inset-5 rounded-lg border border-white/25" />
            <span className="absolute bottom-4 left-4 rounded-full bg-black/55 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
              {cameraReady ? 'Camera connected' : 'Waiting for camera access'}
            </span>
          </div>

          <div className="mt-5 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="body-muted max-w-md text-center text-xs leading-relaxed sm:text-left">
              For best results, use good lighting and keep text sharp and readable.
            </p>
            <button type="button" onClick={capture} disabled={!cameraReady || isAnalyzing}
              className="primary-button w-full shrink-0 sm:w-auto">
              {isAnalyzing ? <Loader2 size={18} className="animate-spin"/> : <CameraIcon size={18}/>}
              {isAnalyzing ? 'Analyzing image...' : 'Capture & solve'}
            </button>
          </div>
        </div>
      </section>

      {error && <div role="alert" className="error-panel flex items-start gap-2 text-sm"><AlertCircle size={18} className="mt-0.5 shrink-0"/>{error}</div>}
      {solution && !error && <Solution solution={solution} isSpeaking={isSpeaking} onToggleSpeech={setIsSpeaking}/>}
    </div>
  );
}
