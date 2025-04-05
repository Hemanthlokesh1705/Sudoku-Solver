// Check if it's safe to place a digit
const isSafe = (board, row, col, digit) => {
    // Check row
    for (let j = 0; j < 9; j++) {
      if (board[row][j] === digit) {
        return false;
      }
    }
  
    // Check column
    for (let i = 0; i < 9; i++) {
      if (board[i][col] === digit) {
        return false;
      }
    }
  
    // Check 3x3 box
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if (board[i][j] === digit) {
          return false;
        }
      }
    }
  
    return true;
  };
  
  // Recursive helper function to solve the Sudoku
  const solveHelper = (board, row = 0, col = 0) => {
    if (row === 9) {
      return true;
    }
  
    let nextRow = row;
    let nextCol = col + 1;
    if (nextCol === 9) {
      nextRow = row + 1;
      nextCol = 0;
    }
  
    if (board[row][col] !== '.') {
      return solveHelper(board, nextRow, nextCol);
    }
  
    // Shuffle digits 1-9 to make random solutions
    const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    for (let i = digits.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [digits[i], digits[j]] = [digits[j], digits[i]];
    }
  
    for (const digit of digits) {
      if (isSafe(board, row, col, digit)) {
        board[row][col] = digit;
        
        if (solveHelper(board, nextRow, nextCol)) {
          return true;
        }
        
        board[row][col] = '.';
      }
    }
  
    return false;
  };
  
  // Main function to solve a Sudoku board
  export const solveSudokuBoard = (board) => {
    return solveHelper(board);
  };
  
  // Function to validate the board
  export const isValidBoard = (board) => {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] !== '.') {
          const digit = board[i][j];
          
          // Temporarily set cell to '.' to check if digit is valid here
          board[i][j] = '.';
          if (!isSafe(board, i, j, digit)) {
            board[i][j] = digit; // Restore the value
            return false;
          }
          board[i][j] = digit; // Restore the value
        }
      }
    }
    return true;
  };
  
  // Function to generate a random solved board
  const generateSolvedBoard = () => {
    const newBoard = Array(9).fill().map(() => Array(9).fill('.'));
    solveHelper(newBoard);
    return newBoard;
  };
  
  // Function to remove digits based on difficulty
  const removeDigits = (solvedBoard, difficulty) => {
    // Deep copy the solved board
    const puzzle = JSON.parse(JSON.stringify(solvedBoard));
    
    // Set number of cells to remove based on difficulty
    let cellsToRemove;
    switch (difficulty) {
      case 'easy':
        cellsToRemove = 30; // 51 clues remain
        break;
      case 'medium':
        cellsToRemove = 45; // 36 clues remain
        break;
      case 'hard':
        cellsToRemove = 55; // 26 clues remain
        break;
      case 'expert':
        cellsToRemove = 60; // 21 clues remain
        break;
      default:
        cellsToRemove = 45;
    }
    
    // Create array of all positions and shuffle it
    const positions = [];
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        positions.push([i, j]);
      }
    }
    
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }
    
    // Remove digits
    for (let i = 0; i < cellsToRemove; i++) {
      const [row, col] = positions[i];
      puzzle[row][col] = '.';
    }
    
    return puzzle;
  };
  
  // Generate a new puzzle with specified difficulty
  export const generatePuzzle = (difficulty) => {
    const solvedBoard = generateSolvedBoard();
    return removeDigits(solvedBoard, difficulty);
  };
  
  // Check if the current board solution is valid
  export const checkSolutionValid = (board) => {
    // Find empty cells
    let hasEmptyCells = false;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] === '.') {
          hasEmptyCells = true;
          break;
        }
      }
      if (hasEmptyCells) break;
    }
    
    if (hasEmptyCells) {
      return {
        valid: false,
        error: 'Please fill in all cells before checking'
      };
    }
    
    // Check if the board is valid
    for (let i = 0; i < 9; i++) {
      // Check rows
      const rowSet = new Set();
      for (let j = 0; j < 9; j++) {
        rowSet.add(board[i][j]);
      }
      if (rowSet.size !== 9) {
        return {
          valid: false,
          error: 'Your solution has errors in row ' + (i + 1)
        };
      }
      
      // Check columns
      const colSet = new Set();
      for (let j = 0; j < 9; j++) {
        colSet.add(board[j][i]);
      }
      if (colSet.size !== 9) {
        return {
          valid: false,
          error: 'Your solution has errors in column ' + (i + 1)
        };
      }
      
      // Check 3x3 boxes
      const boxRow = Math.floor(i / 3) * 3;
      const boxCol = (i % 3) * 3;
      const boxSet = new Set();
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          boxSet.add(board[boxRow + r][boxCol + c]);
        }
      }
      if (boxSet.size !== 9) {
        return {
          valid: false,
          error: 'Your solution has errors in box ' + (i + 1)
        };
      }
    }
    
    // If we get here, the solution is correct
    return {
      valid: true
    };
  };