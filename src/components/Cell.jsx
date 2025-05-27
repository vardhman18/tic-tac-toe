
import { useState, useEffect } from 'react';

// Cell Component
function Cell({ value, onClick, isWinningCell = false, index }) {
  const [isHovered, setIsHovered] = useState(false);
  const [justClicked, setJustClicked] = useState(false);

  useEffect(() => {
    if (value && !justClicked) {
      setJustClicked(true);
      setTimeout(() => setJustClicked(false), 300);
    }
  }, [value]);

  return (
    <div 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative w-24 h-24 bg-gradient-to-br from-white to-gray-50 
        dark:from-gray-800 dark:to-gray-900
        border-2 border-gray-300 dark:border-gray-600
        rounded-xl shadow-lg hover:shadow-xl
        flex items-center justify-center text-4xl font-bold 
        cursor-pointer transition-all duration-300 ease-out
        transform hover:scale-105 active:scale-95
        ${isWinningCell ? 'ring-4 ring-yellow-400 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800' : ''}
        ${justClicked ? 'animate-pulse' : ''}
        ${!value && isHovered ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900' : ''}
      `}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent rounded-xl"></div>
      
      {/* Content */}
      <span className={`
        relative z-10 transition-all duration-300
        ${value === 'X' ? 'text-red-500 dark:text-red-400' : ''}
        ${value === 'O' ? 'text-blue-500 dark:text-blue-400' : ''}
        ${justClicked ? 'animate-bounce' : ''}
      `}>
        {value}
      </span>

      {/* Hover effect */}
      {!value && isHovered && (
        <span className="absolute text-gray-400 dark:text-gray-500 opacity-50 text-3xl">
          ?
        </span>
      )}

      {/* Sparkle effect for winning cells */}
      {isWinningCell && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-2 left-2 w-1 h-1 bg-yellow-300 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
        </div>
      )}
    </div>
  );
}export default Cell;