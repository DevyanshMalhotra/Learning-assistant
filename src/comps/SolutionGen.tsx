import { useEffect } from 'react';
import { Check, Copy, Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';
import { speak, stopSpeaking } from '../utils/speech';

interface Props {
  solution: string;
  isSpeaking: boolean;
  onToggleSpeech: (speaking: boolean) => void;
}

export function Solution({ solution, isSpeaking, onToggleSpeech }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => () => stopSpeaking(), []);

  const toggleSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
      onToggleSpeech(false);
    } else {
      speak(solution, () => onToggleSpeech(false));
      onToggleSpeech(true);
    }
  };

  const copyAnswer = async () => {
    try {
      await navigator.clipboard.writeText(solution);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const formatted = solution
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1');

  return (
    <section className="content-card min-w-0 overflow-hidden p-5 sm:p-7" aria-label="AI answer">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--border)' }}>
        <div>
          <p className="section-label mb-1">Explanation</p>
          <h2 className="text-lg font-bold sm:text-xl">Your answer</h2>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={copyAnswer} className="secondary-button" aria-label="Copy answer">
            {copied ? <Check size={16}/> : <Copy size={16}/>}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button type="button" onClick={toggleSpeech} className="secondary-button"
            aria-label={isSpeaking ? 'Stop reading answer' : 'Read answer aloud'}>
            {isSpeaking ? <VolumeX size={17}/> : <Volume2 size={17}/>}
            <span className="hidden sm:inline">{isSpeaking ? 'Stop' : 'Listen'}</span>
          </button>
        </div>
      </div>
      <div className="answer-body text-sm sm:text-[15px]">{formatted}</div>
    </section>
  );
}
