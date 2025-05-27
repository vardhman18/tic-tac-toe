export function checkWinner(board) {
  const winPatterns = [
    // Rows
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    // Columns  
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    // Diagonals
    [0, 4, 8], [2, 4, 6]
  ];
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return {
        winner: board[a],
        winningCells: pattern
      };
    }
  }
  
  return null;
}

export function isTie(board) {
  return board.every(cell => cell !== null);
}

export function getAvailableMoves(board) {
  return board.map((cell, index) => cell === null ? index : null)
             .filter(index => index !== null);
}

export function isGameOver(board) {
  return checkWinner(board) !== null || isTie(board);
}

export function getGameState(board) {
  const winResult = checkWinner(board);
  
  if (winResult) {
    return {
      status: 'winner',
      winner: winResult.winner,
      winningCells: winResult.winningCells,
      isGameOver: true
    };
  }
  
  if (isTie(board)) {
    return {
      status: 'tie',
      winner: null,
      winningCells: [],
      isGameOver: true
    };
  }
  
  return {
    status: 'playing',
    winner: null,
    winningCells: [],
    isGameOver: false
  };
}

// Utility to evaluate board position for AI
export function evaluateBoard(board, player) {
  const result = checkWinner(board);
  
  if (result?.winner === player) return 10;
  if (result?.winner && result.winner !== player) return -10;
  return 0;
}

// Get the best moves (for suggesting moves to players)
export function getBestMoves(board, player) {
  const moves = getAvailableMoves(board);
  const scoredMoves = [];
  
  for (let move of moves) {
    const newBoard = [...board];
    newBoard[move] = player;
    
    const score = evaluateBoard(newBoard, player);
    scoredMoves.push({ move, score });
  }
  
  return scoredMoves.sort((a, b) => b.score - a.score);
}