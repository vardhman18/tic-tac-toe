import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    // Since we can't use localStorage in artifacts, default to light mode
    return false;
  });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        fixed top-6 right-6 z-50
        flex items-center gap-2 px-4 py-2 rounded-full
        font-medium text-sm transition-all duration-300
        transform hover:scale-110 active:scale-95
        ${dark 
          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 shadow-lg shadow-yellow-500/30' 
          : 'bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-lg shadow-indigo-500/30'
        }
        ${isHovered ? 'shadow-xl' : ''}
      `}
    >
      {/* Icon with rotation animation */}
      <span className={`
        text-lg transition-transform duration-500
        ${isHovered ? 'rotate-180' : 'rotate-0'}
      `}>
        {dark ? '☀️' : '🌙'}
      </span>
      
      {/* Text */}
      <span className="hidden sm:inline">
        {dark ? 'Light Mode' : 'Dark Mode'}
      </span>

      {/* Glow effect */}
      {isHovered && (
        <div className={`
          absolute inset-0 rounded-full blur-sm -z-10
          ${dark ? 'bg-yellow-400/50' : 'bg-indigo-500/50'}
          animate-pulse
        `}></div>
      )}

      {/* Sparkle effects */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping opacity-75"></div>
          <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-white rounded-full animate-ping opacity-50" style={{animationDelay: '0.5s'}}></div>
        </div>
      )}
    </button>
  );
}