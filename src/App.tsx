import React, { useState } from 'react';
import { Camera } from './comps/CameraConf';
import { SpeechInput } from './comps/SpeechConf';

export default function App() {
  const [activeMode, setActiveMode] = useState<string>('image');

  return (
    <div className="App">
      <div className="flex justify-center gap-4 my-6">
        <button
          onClick={() => setActiveMode('image')}
          className={`px-4 py-2 rounded ${activeMode === 'image' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Image Mode
        </button>
        <button
          onClick={() => setActiveMode('speech')}
          className={`px-4 py-2 rounded ${activeMode === 'speech' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Speech Mode
        </button>
      </div>

      <Camera activeMode={activeMode} setActiveMode={setActiveMode} />
      <SpeechInput activeMode={activeMode} setActiveMode={setActiveMode} />
    </div>
  );
}
