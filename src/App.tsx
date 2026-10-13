import { useEffect, useState } from 'react';
import {
  BookOpenText, Camera as CameraIcon, ChevronRight, Clock3,
  GraduationCap, Menu, MessageCircleQuestion, Mic2, Sparkles, X
} from 'lucide-react';
import { Camera } from './comps/CameraConf';
import { SpeechInput } from './comps/SpeechConf';
import { DoubtInput } from './comps/DoubtInput';
import { HistoryView } from './comps/HistoryView';
import { ThemeToggle } from './comps/ThemeTog';
import { setTheme, getInitialTheme } from './utils/theme';
import type { HistoryEntry } from './types';

type Mode = 'image' | 'speech' | 'doubt' | 'history';

const navigation = [
  { id: 'image', label: 'Image solver', hint: 'Capture a question', Icon: CameraIcon },
  { id: 'speech', label: 'Voice assistant', hint: 'Ask out loud', Icon: Mic2 },
  { id: 'doubt', label: 'Ask a question', hint: 'Type your query', Icon: MessageCircleQuestion },
  { id: 'history', label: 'Session history', hint: 'Review answers', Icon: Clock3 },
] as const;

const headings: Record<Mode, { label: string; title: string; description: string }> = {
  image: { label: 'IMAGE ASSISTANT', title: 'Learn from what you see.',
    description: 'Point your camera at a question. Capture it to get an AI-powered explanation.' },
  speech: { label: 'VOICE ASSISTANT', title: 'Questions, spoken naturally.',
    description: 'Speak in your preferred language and receive a written explanation.' },
  doubt: { label: 'TEXT ASSISTANT', title: 'A clearer way to understand.',
    description: 'Write your question and explore a step-by-step response.' },
  history: { label: 'YOUR SESSION', title: 'Pick up where you left off.',
    description: 'Review questions you have explored during this browser session.' },
};

export default function App() {
  const [activeMode, setActiveMode] = useState<Mode>('image');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [theme, setThemeState] = useState<'light' | 'dark'>(getInitialTheme);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => setTheme(theme), [theme]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [sidebarOpen]);

  const navigate = (mode: Mode) => {
    setActiveMode(mode);
    setSidebarOpen(false);
  };
  const current = headings[activeMode];

  return (
    <div className="app-shell min-h-screen lg:flex">
      {sidebarOpen && (
        <button
          type="button" aria-label="Close navigation" className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        aria-label="Main navigation"
        className={`app-sidebar fixed inset-y-0 left-0 z-50 flex w-[282px] max-w-[88vw] flex-col border-r px-5 py-6 transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:shrink-0 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="mb-11 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="brand-mark flex h-11 w-11 items-center justify-center rounded-2xl">
              <GraduationCap size={23} strokeWidth={2.1}/>
            </span>
            <div className="leading-tight">
              <p className="text-[15px] font-bold tracking-tight">eXplore</p>
              <p className="muted-text mt-0.5 text-[11px] tracking-wide">LEARNING ASSISTANT</p>
            </div>
          </div>
          <button type="button" aria-label="Close menu" onClick={() => setSidebarOpen(false)}
            className="icon-button lg:hidden"><X size={20}/></button>
        </div>

        <p className="muted-text mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em]">Workspace</p>
        <nav className="space-y-1.5">
          {navigation.map(({ id, label, hint, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => navigate(id)}
              aria-current={activeMode === id ? 'page' : undefined}
              className={`nav-item group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors ${activeMode === id ? 'nav-active' : ''}`}
            >
              <span className="nav-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                <Icon size={19} strokeWidth={1.9}/>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{label}</span>
                <span className="nav-hint mt-0.5 block truncate text-[11px]">{hint}</span>
              </span>
              {activeMode === id && <ChevronRight size={15} className="shrink-0 opacity-75" aria-hidden="true"/>}
            </button>
          ))}
        </nav>

        <div className="sidebar-note mt-auto rounded-2xl p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold"><Sparkles size={15}/> Made for curious minds</div>
          <p className="text-xs leading-relaxed">Turn a question into a better understanding, one step at a time.</p>
        </div>
        <p className="muted-text mt-5 px-2 text-[11px]">AI responses can make mistakes. Verify important answers.</p>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="app-topbar sticky top-0 z-30 border-b backdrop-blur-xl">
          <div className="mx-auto flex h-[74px] max-w-[1320px] items-center justify-between gap-3 px-4 sm:px-7 lg:px-10">
            <div className="flex min-w-0 items-center gap-3">
              <button type="button" aria-label="Open menu" onClick={() => setSidebarOpen(true)}
                className="icon-button lg:hidden"><Menu size={21}/></button>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <BookOpenText size={18} className="accent-text shrink-0"/>
                  <span className="truncate text-sm font-semibold sm:text-[15px]">Learning workspace</span>
                </div>
                <p className="muted-text mt-0.5 hidden text-xs sm:block">Ask, understand, keep exploring.</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="header-status hidden items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium md:flex">
                <span className="h-2 w-2 rounded-full bg-emerald-500"/> Ready to learn
              </span>
              <ThemeToggle theme={theme} onThemeChange={setThemeState}/>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1320px] px-4 pb-12 pt-6 sm:px-7 sm:pt-9 lg:px-10 lg:pt-11">
          <section className="hero-panel relative mb-6 overflow-hidden rounded-[26px] p-6 sm:mb-8 sm:p-8 lg:p-10">
            <div className="hero-orb pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full"/>
            <div className="relative z-10 max-w-[720px]">
              <p className="hero-eyebrow mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em]">
                <Sparkles size={15}/> {current.label}
              </p>
              <h1 className="text-[29px] font-bold leading-[1.15] tracking-tight sm:text-[39px] lg:text-[44px]">{current.title}</h1>
              <p className="hero-subtitle mt-4 max-w-[585px] text-sm leading-7 sm:text-base">{current.description}</p>
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="hero-tag rounded-full px-3 py-1.5 text-xs font-medium">Image recognition</span>
                <span className="hero-tag rounded-full px-3 py-1.5 text-xs font-medium">Voice input</span>
                <span className="hero-tag rounded-full px-3 py-1.5 text-xs font-medium">Step-by-step answers</span>
              </div>
            </div>
          </section>

          <div className="min-w-0 animate-appear">
            {activeMode === 'image' && (
              <Camera activeMode="image" setActiveMode={() => {}} history={history} setHistory={setHistory}/>
            )}
            {activeMode === 'speech' && (
              <SpeechInput activeMode="speech" setActiveMode={() => {}} history={history} setHistory={setHistory}/>
            )}
            {activeMode === 'doubt' && (
              <DoubtInput history={history} setHistory={setHistory} theme={theme}/>
            )}
            {activeMode === 'history' && <HistoryView history={history}/>}
          </div>
          <footer className="muted-text mt-10 border-t pt-5 text-center text-xs">
            eXplore · Your space to ask better questions and keep learning
          </footer>
        </main>
      </div>
    </div>
  );
}
