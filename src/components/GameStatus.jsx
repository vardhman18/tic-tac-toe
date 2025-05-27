
import { useState, useEffect } from 'react';

export default function GameStatus({ winner, isXNext, tie, aiMode }) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (winner || tie) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }
  }, [winner, tie]);

  const getStatusContent = () => {
    if (winner) {
      return {
        text: `🎉 Player ${winner} Wins!`,
        className: "text-green-500 dark:text-green-400",
        icon: winner === 'X' ? '🔥' : '⭐'
      };
    }
    
    if (tie) {
      return {
        text: "🤝 It's a Tie!",
        className: "text-yellow-500 dark:text-yellow-400",
        icon: '⚖️'
      };
    }

    const currentPlayer = isXNext ? 'X' : 'O';
    const playerType = aiMode && !isXNext ? 'AI' : 'Player';
    
    return {
      text: `${playerType} ${currentPlayer}'s Turn`,
      className: isXNext 
        ? "text-red-500 dark:text-red-400" 
        : "text-blue-500 dark:text-blue-400",
      icon: isXNext ? '❌' : '⭕'
    };
  };

  const { text, className, icon } = getStatusContent();

  return (
    <div className="flex flex-col items-center mb-6">
      {/* Main status */}
      <div className={`
        text-2xl font-bold mb-2 transition-all duration-500
        ${className}
        ${isAnimating ? 'animate-bounce scale-110' : ''}
      `}>
        {text}
      </div>

      {/* Icon with pulse effect */}
      <div className={`
        text-3xl transition-all duration-300
        ${!winner && !tie ? 'animate-pulse' : ''}
        ${isAnimating ? 'animate-spin' : ''}
      `}>
        {icon}
      </div>

      {/* Turn indicator for active game */}
      {!winner && !tie && (
        <div className="mt-3 flex items-center gap-2">
          <div className={`
            w-3 h-3 rounded-full transition-all duration-300
            ${isXNext ? 'bg-red-500 animate-pulse' : 'bg-gray-300 dark:bg-gray-600'}
          `}></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">vs</span>
          <div className={`
            w-3 h-3 rounded-full transition-all duration-300
            ${!isXNext ? 'bg-blue-500 animate-pulse' : 'bg-gray-300 dark:bg-gray-600'}
          `}></div>
        </div>
      )}

      {/* Celebration particles for winner */}
      {winner && (
        <div className="absolute pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 200 - 100}px`,
                top: `${Math.random() * 100 - 50}px`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
}