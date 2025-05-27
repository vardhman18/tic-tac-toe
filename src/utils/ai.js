import { checkWinner, getAvailableMoves, isTie } from './gameUtils';

// AI difficulty levels
export const AI_DIFFICULTY = {
  EASY: 'easy',
  MEDIUM: 'medium', 
  HARD: 'hard',
  IMPOSSIBLE: 'impossible'
};

// Get best move based on difficulty level
export function getBestMove(board, isXNext, difficulty = AI_DIFFICULTY.IMPOSSIBLE) {
  const aiPlayer = isXNext ? 'X' : 'O';
  const humanPlayer = isXNext ? 'O' : 'X';
  
  switch (difficulty) {
    case AI_DIFFICULTY.EASY:
      return getEasyMove(board);
    case AI_DIFFICULTY.MEDIUM:
      return getMediumMove(board, aiPlayer, humanPlayer);
    case AI_DIFFICULTY.HARD:
      return getHardMove(board, aiPlayer, humanPlayer);
    case AI_DIFFICULTY.IMPOSSIBLE:
    default:
      return getImpossibleMove(board, aiPlayer, humanPlayer);
  }
}

// Easy AI - mostly random with basic win/block detection
function getEasyMove(board) {
  const availableMoves = getAvailableMoves(board);
  
  // 70% chance of random move, 30% chance of smart move
  if (Math.random() < 0.7) {
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }
  
  // Basic win/block check
  const smartMove = findWinOrBlockMove(board);
  return smartMove !== null ? smartMove : availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

// Medium AI - balanced strategy
function getMediumMove(board, aiPlayer, humanPlayer) {
  // Priority: Win > Block > Center > Corner > Random
  
  // 1. Try to win
  const winMove = findWinningMove(board, aiPlayer);
  if (winMove !== null) return winMove;
  
  // 2. Block opponent win
  const blockMove = findWinningMove(board, humanPlayer);
  if (blockMove !== null) return blockMove;
  
  // 3. Take center if available
  if (board[4] === null) return 4;
  
  // 4. Take corners
  const corners = [0, 2, 6, 8].filter(i => board[i] === null);
  if (corners.length > 0) {
    return corners[Math.floor(Math.random() * corners.length)];
  }
  
  // 5. Take any available move
  const availableMoves = getAvailableMoves(board);
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

// Hard AI - strategic with occasional mistakes
function getHardMove(board, aiPlayer, humanPlayer) {
  // 90% chance of perfect move, 10% chance of good but not perfect move
  if (Math.random() < 0.9) {
    return getImpossibleMove(board, aiPlayer, humanPlayer);
  } else {
    return getMediumMove(board, aiPlayer, humanPlayer);
  }
}

// Impossible AI - perfect minimax algorithm
function getImpossibleMove(board, aiPlayer, humanPlayer) {
  const result = minimax(board, aiPlayer, aiPlayer, humanPlayer, 0);
  return result.index;
}

// Minimax algorithm with alpha-beta pruning
function minimax(board, currentPlayer, aiPlayer, humanPlayer, depth, alpha = -Infinity, beta = Infinity) {
  const winner = checkWinner(board);
  
  // Terminal states
  if (winner?.winner === aiPlayer) return { score: 10 - depth };
  if (winner?.winner === humanPlayer) return { score: depth - 10 };
  if (isTie(board)) return { score: 0 };
  
  const availableMoves = getAvailableMoves(board);
  const moves = [];
  
  for (let move of availableMoves) {
    const newBoard = [...board];
    newBoard[move] = currentPlayer;
    
    const nextPlayer = currentPlayer === aiPlayer ? humanPlayer : aiPlayer;
    const result = minimax(newBoard, nextPlayer, aiPlayer, humanPlayer, depth + 1, alpha, beta);
    
    moves.push({
      index: move,
      score: result.score
    });
    
    // Alpha-beta pruning
    if (currentPlayer === aiPlayer) {
      alpha = Math.max(alpha, result.score);
    } else {
      beta = Math.min(beta, result.score);
    }
    
    if (beta <= alpha) break;
  }
  
  // Return best move for current player
  if (currentPlayer === aiPlayer) {
    return moves.reduce((best, move) => move.score > best.score ? move : best, { score: -Infinity });
  } else {
    return moves.reduce((best, move) => move.score < best.score ? move : best, { score: Infinity });
  }
}

// Helper functions
function findWinningMove(board, player) {
  const availableMoves = getAvailableMoves(board);
  
  for (let move of availableMoves) {
    const testBoard = [...board];
    testBoard[move] = player;
    
    if (checkWinner(testBoard)?.winner === player) {
      return move;
    }
  }
  
  return null;
}

function findWinOrBlockMove(board) {
  // Try to win first
  const winMove = findWinningMove(board, 'O'); // Assuming AI is O
  if (winMove !== null) return winMove;
  
  // Then try to block
  const blockMove = findWinningMove(board, 'X'); // Block human X
  if (blockMove !== null) return blockMove;
  
  return null;
}

// Strategic move evaluation
export function evaluateMove(board, move, player) {
  const newBoard = [...board];
  newBoard[move] = player;
  
  let score = 0;
  
  // Center control bonus
  if (move === 4) score += 3;
  
  // Corner control bonus
  if ([0, 2, 6, 8].includes(move)) score += 2;
  
  // Check for potential wins/blocks
  const result = checkWinner(newBoard);
  if (result?.winner === player) score += 100;
  
  return score;
}

// Get AI thinking delay based on difficulty (for better UX)
export function getAIDelay(difficulty) {
  switch (difficulty) {
    case AI_DIFFICULTY.EASY:
      return 5+ Math.random() * 5; // 300-800ms
    case AI_DIFFICULTY.MEDIUM:
      return 10 + Math.random() * 10; // 500-1200ms
    case AI_DIFFICULTY.HARD:
      return 15+ Math.random() * 15; // 800-1700ms
    case AI_DIFFICULTY.IMPOSSIBLE:
    default:
      return 25 + Math.random() * 25; // 1000-2000ms
  }
}