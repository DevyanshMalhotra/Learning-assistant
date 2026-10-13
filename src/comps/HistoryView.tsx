import { useState } from 'react';
import { ChevronDown, Clock3 } from 'lucide-react';
import { Solution } from './SolutionGen';
import type { HistoryEntry } from '../types';

export function HistoryView({ history }: { history: HistoryEntry[] }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  return (
    <section className="content-card mx-auto w-full max-w-[980px] p-5 sm:p-7">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="section-label mb-1">In this session</p>
          <h2 className="text-lg font-bold sm:text-xl">Recent questions</h2>
        </div>
        <span className="soft-panel rounded-full px-3 py-1.5 text-xs font-semibold">{history.length} saved</span>
      </div>
      {history.length === 0 ? (
        <div className="soft-panel flex flex-col items-center rounded-2xl px-5 py-12 text-center">
          <Clock3 size={30} className="accent-text mb-3"/>
          <p className="font-semibold">Your learning journey starts here</p>
          <p className="body-muted mt-2 max-w-sm text-sm leading-relaxed">
            Once you explore a question, you can return to its answer during this session.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((entry, index) => (
            <div className="soft-panel min-w-0 overflow-hidden rounded-2xl" key={index}>
              <button type="button" onClick={() => { setExpanded(expanded === index ? null : index); setIsSpeaking(false); }}
                aria-expanded={expanded === index}
                className="flex w-full items-center justify-between gap-3 p-4 text-left sm:p-5">
                <span className="min-w-0">
                  <span className="section-label mb-1 block">{entry.type}</span>
                  <span className="block break-words text-sm font-semibold">{entry.question}</span>
                </span>
                <ChevronDown size={18} className={`accent-text shrink-0 transition-transform ${expanded === index ? 'rotate-180' : ''}`}/>
              </button>
              {expanded === index && (
                <div className="border-t p-3 sm:p-4" style={{ borderColor: 'var(--border)' }}>
                  <Solution solution={entry.solution} isSpeaking={isSpeaking} onToggleSpeech={setIsSpeaking}/>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
