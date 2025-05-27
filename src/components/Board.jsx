import Cell from './Cell';
// Board Component
export default function Board({ board, onClick, winningCells = [] }) {
  return (
    <div className="relative">
      {/* Glow effect */}
      <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl"></div>
      
      {/* Main board */}
      <div className="relative grid grid-cols-3 gap-3 p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
        {board.map((value, index) => (
          <Cell 
            key={index} 
            value={value} 
            onClick={() => onClick(index)}
            isWinningCell={winningCells.includes(index)}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}