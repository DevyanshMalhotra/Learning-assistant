import { useEffect, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { Globe2, LoaderCircle, Mic2, MicOff, Radio } from 'lucide-react';
import { analyzeText } from '../utils/gemini';
import { Solution } from './SolutionGen';
import type { HistoryEntry } from '../types';

interface SpeechResult {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}
interface BrowserRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechResult) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}
type RecognitionWindow = Window & {
  SpeechRecognition?: new () => BrowserRecognition;
  webkitSpeechRecognition?: new () => BrowserRecognition;
};

interface Props {
  setHistory: Dispatch<SetStateAction<HistoryEntry[]>>;
}

const languages = [
  { code: 'en-US', label: 'English' },
  { code: 'hi-IN', label: 'Hindi' },
  { code: 'bn-IN', label: 'Bengali' },
  { code: 'te-IN', label: 'Telugu' },
  { code: 'ta-IN', label: 'Tamil' },
  { code: 'mr-IN', label: 'Marathi' },
  { code: 'ur-IN', label: 'Urdu' },
  { code: 'gu-IN', label: 'Gujarati' },
  { code: 'pa-IN', label: 'Punjabi' },
  { code: 'ml-IN', label: 'Malayalam' },
  { code: 'kn-IN', label: 'Kannada' },
];

export function SpeechInput({ setHistory }: Props) {
  const recognitionRef = useRef<BrowserRecognition | null>(null);
  const [language, setLanguage] = useState('hi-IN');
  const [solution, setSolution] = useState('');
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => () => recognitionRef.current?.stop(), []);

  const stopListening = () => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
  };

  const handleSpeechInput = () => {
    const speechWindow = window as RecognitionWindow;
    const Recognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (!Recognition) {
      setError('This browser does not support speech recognition. Try Chrome or use the text assistant.');
      return;
    }

    setError('');
    setSolution('');
    setTranscript('');

    const recognition = new Recognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language;
    recognitionRef.current = recognition;

    recognition.onresult = async event => {
      const heard = event.results[0]?.[0]?.transcript?.trim();
      setIsListening(false);
      if (!heard) {
        setError('No speech was detected. Please try again.');
        return;
      }

      setTranscript(heard);
      setIsProcessing(true);
      try {
        const answer = await analyzeText(heard);
        setSolution(answer);
        setHistory(previous => [{ type: 'speech', question: heard, solution: answer }, ...previous]);
      } catch {
        setError('Could not process the question. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    };
    recognition.onerror = event => {
      setIsListening(false);
      if (event.error !== 'aborted') setError(`Speech recognition error: ${event.error}`);
    };
    recognition.onend = () => setIsListening(false);

    try {
      recognition.start();
      setIsListening(true);
    } catch {
      setIsListening(false);
      setError('Could not start speech recognition. Check microphone permissions.');
    }
  };

  return (
    <div className="mx-auto w-full max-w-[980px] space-y-5 sm:space-y-6">
      <section className="content-card p-5 sm:p-7 lg:p-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="section-label mb-2">Microphone input</p>
            <h2 className="text-lg font-bold sm:text-xl">Talk through a question</h2>
            <p className="body-muted mt-2 max-w-xl text-sm leading-6">
              Select a language, start recording, and speak naturally.
            </p>
          </div>
          <span className="soft-panel flex items-center gap-2 rounded-full px-3 py-2 text-xs">
            <Globe2 size={15}/> Multiple languages
          </span>
        </div>

        <label htmlFor="language" className="mb-2 block text-sm font-semibold">Recognition language</label>
        <select id="language" value={language} onChange={event => setLanguage(event.target.value)}
          disabled={isListening || isProcessing} className="form-field max-w-md text-sm">
          {languages.map(item => <option key={item.code} value={item.code}>{item.label}</option>)}
        </select>

        <div className="soft-panel relative mt-6 flex min-h-[250px] flex-col items-center justify-center rounded-2xl px-5 py-9 text-center sm:min-h-[285px]">
          <span className={`mb-5 flex h-[82px] w-[82px] items-center justify-center rounded-full transition-all ${isListening ? 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300 animate-pulse' : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300'}`}>
            {isListening ? <Radio size={35}/> : <Mic2 size={35}/>}
          </span>
          <h3 className="text-lg font-bold">{isListening ? 'Listening to you...' : isProcessing ? 'Working on your answer...' : 'Ready when you are'}</h3>
          <p className="body-muted mt-2 max-w-md text-sm leading-relaxed">
            {isListening ? 'Speak clearly into your microphone. Press Stop when finished.' : 'Your microphone is only used after you start recording.'}
          </p>
          <button type="button" disabled={isProcessing}
            onClick={isListening ? stopListening : handleSpeechInput}
            className={`mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60 ${isListening ? 'bg-rose-600' : 'bg-indigo-600'}`}>
            {isListening ? <MicOff size={18}/> : isProcessing ? <LoaderCircle size={18} className="animate-spin"/> : <Mic2 size={18}/>}
            {isListening ? 'Stop listening' : isProcessing ? 'Processing...' : 'Start speaking'}
          </button>
        </div>

        {transcript && <div className="mt-5 rounded-xl border p-4" style={{ borderColor: 'var(--border)' }}>
          <p className="section-label mb-2">You said</p>
          <p className="break-words text-sm">{transcript}</p>
        </div>}
        {error && <div role="alert" className="error-panel mt-5 text-sm">{error}</div>}
      </section>
      {solution && !error && <Solution solution={solution} isSpeaking={isSpeaking} onToggleSpeech={setIsSpeaking}/>}
    </div>
  );
}
