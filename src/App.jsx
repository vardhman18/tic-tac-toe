import React, { useEffect, useState } from 'react';
import Board from './components/Board';
import GameStatus from './components/GameStatus';
import Scoreboard from './components/Scoreboard';
import GameModeToggle from './components/GameModeToggle';
import ThemeToggle from './components/ThemeToggle';
import SettingsPanel from './components/SettingsPanel';
import { checkWinner, isTie, getGameState } from './utils/gameUtils';
import { getBestMove, getAIDelay, AI_DIFFICULTY } from './utils/ai';
import { playSound } from './utils/SoundManager';

export default function App() {
  // Game state
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [aiMode, setAIMode] = useState(false);
  const [aiDifficulty, setAiDifficulty] = useState(AI_DIFFICULTY.IMPOSSIBLE);
  const [isAIThinking, setIsAIThinking] = useState(false);

  // UI state
  const [showSettings, setShowSettings] = useState(false);
  const [gameHistory, setGameHistory] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);

  // Get current game state
  const gameState = getGameState(board);
  const { winner, winningCells, isGameOver } = gameState;

  // Handle cell click
  const handleClick = (index) => {
    // Prevent clicks during AI turn or if game is over or cell is occupied
    if (board[index] || isGameOver || (aiMode && !isXNext) || isAIThinking) {
      return;
    }
    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';

    setBoard(newBoard);
    setIsXNext(!isXNext);
    playSound('click');
  };

  // AI move logic
  useEffect(() => {
    if (aiMode && !isXNext && !isGameOver && !isAIThinking) {
      setIsAIThinking(true);

      const delay = getAIDelay(aiDifficulty);
      const timeoutId = setTimeout(() => {
        const aiMove = getBestMove(board, false, aiDifficulty);
        if (aiMove !== undefined && board[aiMove] === null) {
          const newBoard = [...board];
          newBoard[aiMove] = 'O';
          setBoard(newBoard);
          setIsXNext(true);
          playSound('click');
        }
        setIsAIThinking(false);
      }, delay);

      return () => clearTimeout(timeoutId);
    }
  }, [board, aiMode, isXNext, isGameOver, aiDifficulty, isAIThinking]);

  // Handle game end
  useEffect(() => {
    if (winner) {
      setScores(prev => ({ ...prev, [winner]: prev[winner] + 1 }));
      setGameHistory(prev => [...prev, { winner, date: new Date() }]);
      setShowCelebration(true);
      playSound('win');

      setTimeout(() => setShowCelebration(false), 3000);
    } else if (gameState.status === 'tie') {
      setGameHistory(prev => [...prev, { winner: 'tie', date: new Date() }]);
      playSound('tie');
    }
  }, [winner, gameState.status]);

  // Game controls
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setIsAIThinking(false);
    setShowCelebration(false);
    playSound('reset');
  };

  const toggleAIMode = () => {
    setAIMode(!aiMode);
    resetGame();
    setScores({ X: 0, O: 0 });
    setGameHistory([]);
    playSound('modeSwitch');
  };

  const resetScores = () => {
    setScores({ X: 0, O: 0 });
    setGameHistory([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 transition-all duration-500">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 dark:bg-yellow-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 dark:bg-pink-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      {/* Theme Toggle */}
      <ThemeToggle />
      {/* Settings Button */}
      <button
        onClick={() => {
          setShowSettings(true);
          playSound('click');
        }}
        className="fixed top-6 left-6 z-40 w-12 h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-xl hover:scale-110"
      >
        ⚙️
      </button>
      {/* Main Game Container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent mb-2">
            Tic-Tac-Toe
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {aiMode ? '🤖 Challenge the AI' : '👥 Play with Friends'}
          </p>
        </div>
        {/* Game Mode Toggle */}
        <GameModeToggle aiMode={aiMode} toggleAIMode={toggleAIMode} />
        {/* Scoreboard */}
        <Scoreboard scores={scores} aiMode={aiMode} />
        {/* Game Status */}
        <GameStatus 
          winner={winner} 
          isXNext={isXNext} 
          tie={gameState.status === 'tie'} 
          aiMode={aiMode}
        />
        {/* AI Thinking Indicator */}
        {isAIThinking && (
          <div className="mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            <span className="text-sm font-medium">AI is thinking...</span>
          </div>
        )}
        {/* Game Board */}
        <Board 
          board={board} 
          onClick={handleClick} 
          winningCells={winningCells}
        />
        {/* Game Controls */}
        <div className="mt-6 flex gap-3">
          {isGameOver && (
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              🎮 New Game
            </button>
          )}

          <button
            onClick={resetGame}
            className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
          >
            🔄 Reset
          </button>
        </div>
        {/* Game Stats */}
        {gameHistory.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Games played: {gameHistory.length}
            {gameHistory.length >= 5 && (
              <div className="mt-1">
                Recent: {gameHistory.slice(-5).map(game => 
                  game.winner === 'tie' ? '⚪' : (game.winner === 'X' ? '❌' : '⭕')
                ).join(' ')}
              </div>
            )}
          </div>
        )}
      </div>
      {/* Settings Panel */}
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        aiDifficulty={aiDifficulty}
        onDifficultyChange={setAiDifficulty}
        onResetScores={resetScores}
      />

      {/* Celebration Animation */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-6xl animate-bounce">🎉</div>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-yellow-400 rounded-full animate-ping"
              style={{
                left: `${50 + (Math.random() - 0.5) * 80}%`,
                top: `${50 + (Math.random() - 0.5) * 80}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}