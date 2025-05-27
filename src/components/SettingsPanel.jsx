import { useState } from 'react';
import { AI_DIFFICULTY } from '../utils/ai';
import { playSound, setVolume, toggleSounds, isSoundsEnabled } from '../utils/SoundManager';

export default function SettingsPanel({ 
  isOpen, 
  onClose, 
  aiDifficulty, 
  onDifficultyChange,
  onResetScores 
}) {
  const [soundEnabled, setSoundEnabled] = useState(isSoundsEnabled());
  const [volume, setVolumeState] = useState(70);

  const handleVolumeChange = (newVolume) => {
    setVolumeState(newVolume);
    setVolume(newVolume / 100);
    playSound('click');
  };

  const handleToggleSounds = () => {
    const newState = toggleSounds();
    setSoundEnabled(newState);
    if (newState) playSound('click');
  };

  const difficultyLabels = {
    [AI_DIFFICULTY.EASY]: { label: 'Easy', icon: '😊', color: 'green' },
    [AI_DIFFICULTY.MEDIUM]: { label: 'Medium', icon: '🤔', color: 'yellow' },
    [AI_DIFFICULTY.HARD]: { label: 'Hard', icon: '😤', color: 'orange' },
    [AI_DIFFICULTY.IMPOSSIBLE]: { label: 'Impossible', icon: '🤖', color: 'red' }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            ⚙️ Settings
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* AI Difficulty */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              🤖 AI Difficulty
            </h3>
            <div className="space-y-2">
              {Object.entries(AI_DIFFICULTY).map(([key, value]) => {
                const config = difficultyLabels[value];
                return (
                  <button
                    key={value}
                    onClick={() => {
                      onDifficultyChange(value);
                      playSound('click');
                    }}
                    className={`
                      w-full p-3 rounded-lg border-2 transition-all duration-200
                      flex items-center justify-between
                      ${aiDifficulty === value
                        ? `border-${config.color}-500 bg-${config.color}-50 dark:bg-${config.color}-900/20`
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{config.icon}</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {config.label}
                      </span>
                    </div>
                    {aiDifficulty === value && (
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Choose your challenge level when playing against AI
            </p>
          </div>

          {/* Sound Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              🔊 Sound Settings
            </h3>
            
            {/* Sound Toggle */}
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg mb-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">{soundEnabled ? '🔊' : '🔇'}</span>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Sound Effects
                </span>
              </div>
              <button
                onClick={handleToggleSounds}
                className={`
                  relative w-12 h-6 rounded-full transition-colors duration-200
                  ${soundEnabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}
                `}
              >
                <div className={`
                  absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200
                  ${soundEnabled ? 'translate-x-7' : 'translate-x-1'}
                `}></div>
              </button>
            </div>

            {/* Volume Slider */}
            {soundEnabled && (
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Volume: {volume}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            )}
          </div>

          {/* Game Actions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              🎮 Game Actions
            </h3>
            <button
              onClick={() => {
                onResetScores();
                playSound('reset');
              }}
              className="w-full p-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
            >
              🔄 Reset All Scores
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              This will reset the scoreboard to 0-0
            </p>
          </div>

          {/* About */}
          <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Enhanced Tic-Tac-Toe
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Featuring smart AI, beautiful animations, and immersive sound effects
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}