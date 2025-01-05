import React, { useState, useEffect } from 'react';
import { Camera } from './comps/CameraConf';
import { SpeechInput } from './comps/SpeechConf';
import { ThemeToggle } from './comps/ThemeTog';
import { setTheme, getInitialTheme } from './utils/theme';

export default function App() {
  const [activeMode, setActiveMode] = useState<string>('image');
  const [theme, setThemeState] = useState<'light' | 'dark'>(getInitialTheme());

  useEffect(() => {
    setTheme(theme);
  }, [theme]);

  return (
    <div className="App min-h-screen flex flex-col bg-white dark:bg-gray-900 text-black dark:text-white transition-colors">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveMode('image')}
            className={`px-6 py-2 rounded ${activeMode === 'image' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-800'}`}
          >
            Image Mode
          </button>
          <button
            onClick={() => setActiveMode('speech')}
            className={`px-6 py-2 rounded ${activeMode === 'speech' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-800'}`}
          >
            Speech Mode
          </button>
        </div>
        
        <ThemeToggle theme={theme} onThemeChange={setThemeState} />
      </div>

      <div className="flex flex-col items-center justify-center flex-1">
        <Camera activeMode={activeMode} setActiveMode={setActiveMode} />
        <SpeechInput activeMode={activeMode} setActiveMode={setActiveMode} />
      </div>
    </div>
  );
}

