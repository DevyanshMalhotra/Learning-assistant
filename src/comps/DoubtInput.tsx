import { useEffect, useState } from 'react';
import type { Dispatch, FormEvent, SetStateAction } from 'react';
import { ArrowUpRight, MessageCircleQuestion, Sparkles } from 'lucide-react';
import { analyzeText } from '../utils/gemini';
import { stopSpeaking } from '../utils/speech';
import { Solution } from './SolutionGen';
import type { HistoryEntry } from '../types';

interface Props {
  setHistory: Dispatch<SetStateAction<HistoryEntry[]>>;
}

export function DoubtInput({ setHistory }: Props) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => () => stopSpeaking(), []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || loading) return;

    setLoading(true);
    setAnswer('');
    stopSpeaking();
    setIsSpeaking(false);
    try {
      const result = await analyzeText(trimmedQuestion);
      setAnswer(result);
      setHistory(previous => [{
        type: 'doubt', question: trimmedQuestion, solution: result,
      }, ...previous]);
      setQuestion('');
    } catch {
      setAnswer('Something went wrong. Please try submitting your question again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[980px] space-y-5 sm:space-y-6">
      <section className="content-card p-5 sm:p-7 lg:p-8">
        <div className="mb-5 flex items-center gap-3">
          <span className="soft-panel flex h-12 w-12 items-center justify-center rounded-2xl">
            <MessageCircleQuestion size={22} className="accent-text"/>
          </span>
          <div>
            <p className="section-label mb-1">Text input</p>
            <h2 className="text-lg font-bold sm:text-xl">What would you like to understand?</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="question" className="mb-2 block text-sm font-semibold">Your question</label>
          <textarea id="question" value={question} onChange={event => setQuestion(event.target.value)}
            placeholder="For example: Explain how binary search works, with a simple example..."
            rows={7} maxLength={5000}
            className="form-field min-h-[190px] resize-y text-sm leading-7"
            aria-describedby="question-help"
          />
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p id="question-help" className="body-muted text-xs leading-relaxed">
              <Sparkles size={14} className="mr-1 inline"/> Specific questions often lead to clearer answers.
            </p>
            <button type="submit" disabled={!question.trim() || loading} className="primary-button w-full sm:w-auto">
              {loading ? 'Thinking...' : 'Get explanation'}
              {!loading && <ArrowUpRight size={18}/>}
            </button>
          </div>
        </form>
      </section>

      {answer && <Solution solution={answer} isSpeaking={isSpeaking} onToggleSpeech={setIsSpeaking}/>}
    </div>
  );
}
