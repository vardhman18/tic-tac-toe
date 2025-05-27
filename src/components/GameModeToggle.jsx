import { useState } from 'react';

export default function GameModeToggle({ aiMode, toggleAIMode }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="mb-6 relative">
      <div className="flex flex-col items-center gap-3">
        {/* Mode label */}
        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Game Mode
        </div>

        {/* Toggle switch */}
        <button
          type="button"
          onClick={toggleAIMode}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative w-64 h-12 rounded-full p-1 transition-all duration-300 focus:outline-none"
        >
          {/* Track */}
          <div className={`
            w-full h-full rounded-full transition-all duration-300
            ${aiMode 
              ? 'bg-gradient-to-r from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/30' 
              : 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/30'}
            ${isHovered ? 'scale-105 shadow-xl' : ''}
          `}>
            {/* Indicator */}
            <div className={`
              w-1/2 h-full bg-white rounded-full shadow-lg
              transition-all duration-300 ease-out transform
              ${aiMode ? 'translate-x-full' : 'translate-x-0'}
              flex items-center justify-center
            `}></div>
          </div>

          {/* Labels */}
          <div className="absolute inset-0 flex items-center justify-between px-4 text-white font-medium text-sm pointer-events-none">
            <div className={`flex items-center gap-1 transition-all duration-300 ${!aiMode ? 'opacity-100 scale-100' : 'opacity-70 scale-95'}`}>
              <span>👥</span><span>Two Player</span>
            </div>
            <div className={`flex items-center gap-1 transition-all duration-300 ${aiMode ? 'opacity-100 scale-100' : 'opacity-70 scale-95'}`}>
              <span>AI Challenge</span><span>🤖</span>
            </div>
          </div>
        </button>

        {/* Description */}
        <div className="text-center">
          <div className={`text-sm font-medium transition-all duration-300 ${aiMode ? 'text-purple-600 dark:text-purple-400' : 'text-green-600 dark:text-green-400'}`}>
            {aiMode ? '🎯 Challenge the AI' : '🎮 Play with a Friend'}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {aiMode ? 'Test your skills against our smart AI' : 'Take turns on the same device'}
          </div>
        </div>
      </div>

      {/* Decorative hover animation */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-2 h-2 bg-white rounded-full animate-ping absolute top-2 right-8"></div>
          <div className="w-1 h-1 bg-white rounded-full animate-ping absolute bottom-3 left-12" style={{ animationDelay: '0.3s' }}></div>
        </div>
      )}
    </div>
  );
}
