import React, { useState, useEffect } from 'react';
import { Camera } from './comps/CameraConf';
import { SpeechInput } from './comps/SpeechConf';
import { ThemeToggle } from './comps/ThemeTog';
import { HistoryView } from './comps/HistoryView';
import { DoubtInput } from './comps/DoubtInput'; // Import DoubtInput component
import { setTheme, getInitialTheme } from './utils/theme';
import Typewriter from 'react-typewriter-effect';
import {
  FaHistory,
  FaImage,
  FaMicrophone,
  FaBars,
  FaTimes,
  FaRocket,
  FaQuestion,
} from 'react-icons/fa';

export default function App() {
  const [activeMode, setActiveMode] = useState<string>('image');
  const [history, setHistory] = useState<any[]>([]);
  const [theme, setThemeState] = useState<'light' | 'dark'>(getInitialTheme());
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar visibility for mobile
  const [viewHistory, setViewHistory] = useState(false); // Toggle for history view

  useEffect(() => {
    setTheme(theme);
  }, [theme]);

  // Toggle Sidebar (for mobile view)
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div
      className={`App min-h-screen flex transition-all bg-${
        theme === 'dark' ? 'gray-900' : 'white'
      } text-${theme === 'dark' ? 'white' : 'black'}`}
    >
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 w-72 h-full bg-${
          theme === 'dark' ? 'gray-800' : 'white'
        } shadow-xl transform transition-all duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col items-center p-6 space-y-6">
          <button
            onClick={toggleSidebar}
            className={`text-2xl ${
              theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
            } p-2 rounded-full focus:outline-none transition-all lg:hidden`}
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Branding */}
          <div className="text-3xl font-extrabold text-blue-500 font-techno">eXplore</div>

          <div className="space-y-4 w-full">
            {/* Navigation Icons */}
            <button
              onClick={() => {
                setActiveMode('image');
                setViewHistory(false);
              }}
              className={`flex items-center justify-start space-x-4 p-4 w-full rounded-lg transition-all duration-300 ${
                activeMode === 'image' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <FaImage />
              <span>Image Mode</span>
            </button>
            <button
              onClick={() => {
                setActiveMode('speech');
                setViewHistory(false);
              }}
              className={`flex items-center justify-start space-x-4 p-4 w-full rounded-lg transition-all duration-300 ${
                activeMode === 'speech' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <FaMicrophone />
              <span>Speech Mode</span>
            </button>
            <button
              onClick={() => {
                setViewHistory(true);
                setActiveMode('');
              }}
              className={`flex items-center justify-start space-x-4 p-4 w-full rounded-lg transition-all duration-300 ${
                viewHistory ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <FaHistory />
              <span>History</span>
            </button>
            <button
              onClick={() => {
                setActiveMode('doubt');
                setViewHistory(false);
              }}
              className={`flex items-center justify-start space-x-4 p-4 w-full rounded-lg transition-all duration-300 ${
                activeMode === 'doubt' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <FaQuestion />
              <span>Doubt Mode</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 ml-0 lg:ml-72 p-4 transition-all`}>
        {/* Header (Navbar) */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            {/* Sidebar Toggle Icon (Hamburger on mobile) */}
            <button
              onClick={toggleSidebar}
              className={`lg:hidden text-2xl ${
                theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
              } p-2 rounded-full focus:outline-none`}
            >
              {sidebarOpen ? <FaTimes /> : <FaBars />}
            </button>

            {/* Icon in Header */}
            <div className={`text-4xl ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`}>
              <FaRocket />
            </div>
            {/* Branding */}
            <div className="text-2xl font-extrabold text-blue-500 font-techno">Learning Assistant</div>
          </div>
          <ThemeToggle theme={theme} onThemeChange={setThemeState} />
        </div>

        {/* Welcome Text (Centered) */}
        {!viewHistory && (
          <div className="flex justify-center items-center w-full py-0 m-0 text-3xl text-center font-mono mb-6">
            <Typewriter
              text="<<Welcome to Learning Assistant!>>"
              cursorColor={theme === 'dark' ? 'white' : 'black'}
              typeSpeed={100}
              deleteSpeed={50}
              delaySpeed={2000}
              textStyle={{
                color: theme === 'dark' ? '#ffffff' : '#000000',
              }}
            />
          </div>
        )}
        {/* Mode Content */}
        {viewHistory ? (
          <div className="space-y-4">
            {/* History View */}
            <HistoryView history={history} />
          </div>
        ) : (
          <div className="flex justify-center space-x-8">
            {activeMode === 'image' && (
              <Camera activeMode={activeMode} setActiveMode={setActiveMode} history={history} setHistory={setHistory} />
            )}
            {activeMode === 'speech' && (
              <SpeechInput activeMode={activeMode} setActiveMode={setActiveMode} history={history} setHistory={setHistory} />
            )}
            {activeMode === 'doubt' && (
              <DoubtInput history={history} setHistory={setHistory} theme={theme} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
