import React, { useState, useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';

function SudokuSolver() {
  const [board, setBoard] = useState(Array(9).fill().map(() => Array(9).fill('.')));
  const [originalBoard, setOriginalBoard] = useState(Array(9).fill().map(() => Array(9).fill('.')));
  const [solving, setSolving] = useState(false);
  const [solved, setSolved] = useState(false);
  const [error, setError] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [highlightedCell, setHighlightedCell] = useState(null);
  const [timer, setTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  // Format timer as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // Function to check if it's safe to place a digit
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
  const solveHelper = (board, row, col) => {
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

  // Main function to solve the Sudoku
  const solveSudoku = () => {
    setError('');
    setSolving(true);
    
    // Validate board before solving
    if (!isValidBoard()) {
      setError('Invalid board configuration');
      setSolving(false);
      return;
    }
    
    // Create a deep copy of the board
    const boardCopy = JSON.parse(JSON.stringify(board));
    
    // Solve the board
    const result = solveHelper(boardCopy, 0, 0);
    
    if (result) {
      setBoard(boardCopy);
      setSolved(true);
    } else {
      setError('No solution exists for this board configuration');
    }
    
    setSolving(false);
  };

  // Function to validate the initial board
  const isValidBoard = () => {
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

  // Function to handle cell input change
  const handleCellChange = (row, col, value) => {
    // Only allow changes to non-original cells
    if (originalBoard[row][col] === '.') {
      // Only allow digits 1-9 or empty
      if (value === '' || (value >= '1' && value <= '9')) {
        const newBoard = [...board];
        newBoard[row][col] = value === '' ? '.' : value;
        setBoard(newBoard);
        setSolved(false);
      }
    }
  };

  // Function to clear user inputs but keep original puzzle
  const resetBoard = () => {
    setBoard(JSON.parse(JSON.stringify(originalBoard)));
    setSolved(false);
    setError('');
  };

  // Function to clear the board completely
  const clearBoard = () => {
    setBoard(Array(9).fill().map(() => Array(9).fill('.')));
    setOriginalBoard(Array(9).fill().map(() => Array(9).fill('.')));
    setSolved(false);
    setError('');
    setTimerRunning(false);
    setTimer(0);
  };

  // Function to generate a random solved board
  const generateSolvedBoard = () => {
    const newBoard = Array(9).fill().map(() => Array(9).fill('.'));
    solveHelper(newBoard, 0, 0);
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

  // Generate a new random puzzle
  const generatePuzzle = () => {
    setSolving(true);
    setError('');
    setSolved(false);
    setTimerRunning(false);
    setTimer(0);
    
    // Generate a solved board
    const solvedBoard = generateSolvedBoard();
    
    // Remove digits based on difficulty
    const puzzle = removeDigits(solvedBoard, difficulty);
    
    // Set the board and original board
    setBoard(puzzle);
    setOriginalBoard(JSON.parse(JSON.stringify(puzzle)));
    
    // Start the timer
    setTimerRunning(true);
    setSolving(false);
  };

  // Check if the current board is correct
  const checkSolution = () => {
    // Create a deep copy of the board
    const boardCopy = JSON.parse(JSON.stringify(board));
    
    // Find empty cells
    let hasEmptyCells = false;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (boardCopy[i][j] === '.') {
          hasEmptyCells = true;
          break;
        }
      }
      if (hasEmptyCells) break;
    }
    
    if (hasEmptyCells) {
      setError('Please fill in all cells before checking');
      return;
    }
    
    // Check if the board is valid
    for (let i = 0; i < 9; i++) {
      // Check rows
      const rowSet = new Set();
      for (let j = 0; j < 9; j++) {
        rowSet.add(boardCopy[i][j]);
      }
      if (rowSet.size !== 9) {
        setError('Your solution has errors');
        return;
      }
      
      // Check columns
      const colSet = new Set();
      for (let j = 0; j < 9; j++) {
        colSet.add(boardCopy[j][i]);
      }
      if (colSet.size !== 9) {
        setError('Your solution has errors');
        return;
      }
      
      // Check 3x3 boxes
      const boxRow = Math.floor(i / 3) * 3;
      const boxCol = (i % 3) * 3;
      const boxSet = new Set();
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          boxSet.add(boardCopy[boxRow + r][boxCol + c]);
        }
      }
      if (boxSet.size !== 9) {
        setError('Your solution has errors');
        return;
      }
    }
    
    // If we get here, the solution is correct
    setError('');
    setSolved(true);
    setTimerRunning(false);
  };

  const getCellClass = (rowIndex, colIndex, value) => {
    const isOriginal = originalBoard[rowIndex][colIndex] !== '.';
    const isHighlighted = highlightedCell && 
                         (highlightedCell.row === rowIndex || 
                          highlightedCell.col === colIndex || 
                          (Math.floor(highlightedCell.row / 3) === Math.floor(rowIndex / 3) && 
                           Math.floor(highlightedCell.col / 3) === Math.floor(colIndex / 3)));
    const isSameValue = value !== '.' && highlightedCell && board[highlightedCell.row][highlightedCell.col] === value;
    
    let classes = "sudoku-cell form-control text-center p-0";
    
    if (rowIndex === highlightedCell?.row && colIndex === highlightedCell?.col) {
      classes += " bg-primary text-white";
    } else if (solved && !isOriginal) {
      classes += " bg-success bg-opacity-25";
    } else if (isOriginal) {
      classes += " bg-light fw-bold";
    } else if (isSameValue) {
      classes += " bg-warning bg-opacity-25";
    } else if (isHighlighted) {
      classes += " bg-info bg-opacity-10";
    }
    
    return classes;
  };

  const getBorderStyle = (rowIndex, colIndex) => {
    let style = {};
    
    if ((rowIndex + 1) % 3 === 0 && rowIndex < 8) {
      style.borderBottom = '2px solid #000';
    }
    
    if ((colIndex + 1) % 3 === 0 && colIndex < 8) {
      style.borderRight = '2px solid #000';
    }
    
    return style;
  };

  useEffect(() => {
    // Generate a puzzle when the component mounts
    generatePuzzle();
  }, []);

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col-12 text-center">
          <h1 className="display-4 text-primary">Sudoku Challenge</h1>
          <p className="lead">Generate, play, and solve Sudoku puzzles</p>
        </div>
      </div>
      
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card shadow mb-3">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <span className="h5 mb-0">Game Controls</span>
              <span className="h5 mb-0 badge bg-light text-dark">{formatTime(timer)}</span>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-6">
                  <div className="form-group mb-3">
                    <label htmlFor="difficultySelect" className="form-label">Difficulty:</label>
                    <select 
                      id="difficultySelect"
                      className="form-select"
                      value={difficulty} 
                      onChange={(e) => setDifficulty(e.target.value)}
                      disabled={solving || timerRunning}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>
                </div>
                <div className="col-6 d-flex align-items-end">
                  <button
                    onClick={generatePuzzle}
                    disabled={solving}
                    className="btn btn-primary w-100"
                  >
                    <i className="bi bi-plus-circle me-2"></i>New Game
                  </button>
                </div>
              </div>
              
              <div className="row">
                <div className="col-6">
                  <button
                    onClick={checkSolution}
                    disabled={solving || solved}
                    className="btn btn-success w-100 mb-2"
                  >
                    <i className="bi bi-check-circle me-2"></i>Check Solution
                  </button>
                </div>
                <div className="col-6">
                  <button
                    onClick={resetBoard}
                    disabled={solving}
                    className="btn btn-warning w-100 mb-2"
                  >
                    <i className="bi bi-arrow-counterclockwise me-2"></i>Reset
                  </button>
                </div>
              </div>
              
              <div className="row">
                <div className="col-6">
                  <button
                    onClick={solveSudoku}
                    disabled={solving}
                    className="btn btn-info w-100"
                  >
                    <i className="bi bi-lightbulb me-2"></i>Solve For Me
                  </button>
                </div>
                <div className="col-6">
                  <button
                    onClick={clearBoard}
                    disabled={solving}
                    className="btn btn-secondary w-100"
                  >
                    <i className="bi bi-trash me-2"></i>Clear All
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="alert alert-danger" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          )}
          
          {solved && (
            <div className="alert alert-success" role="alert">
              <i className="bi bi-trophy-fill me-2"></i>
              Puzzle solved! Great job!
            </div>
          )}
          
          <div className="card shadow">
            <div className="card-header bg-info text-white">
              <i className="bi bi-info-circle me-2"></i>How to Play
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">Select difficulty and click "New Game" to generate a random puzzle</li>
                <li className="list-group-item">Click a cell and enter numbers or use the number pad below</li>
                <li className="list-group-item">Use "Check Solution" to verify your answer</li>
                <li className="list-group-item">Use "Reset" to start over with the same puzzle</li>
                <li className="list-group-item">Use "Solve For Me" if you get stuck</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header bg-dark text-white">
              <span className="h5 mb-0">Sudoku Board</span>
            </div>
            <div className="card-body p-3">
              <div className="sudoku-board border border-dark mb-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', backgroundColor: '#000', gap: '1px' }}>
                {board.map((row, rowIndex) => (
                  row.map((cell, colIndex) => {
                    const isOriginal = originalBoard[rowIndex][colIndex] !== '.';
                    return (
                      <input
                        key={`${rowIndex}-${colIndex}`}
                        type="text"
                        maxLength="1"
                        value={cell === '.' ? '' : cell}
                        onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                        onFocus={() => setHighlightedCell({ row: rowIndex, col: colIndex })}
                        onBlur={() => setHighlightedCell(null)}
                        className={getCellClass(rowIndex, colIndex, cell)}
                        style={{
                          width: '100%',
                          height: '40px',
                          fontSize: '20px',
                          ...getBorderStyle(rowIndex, colIndex)
                        }}
                        disabled={solving || isOriginal || solved}
                      />
                    );
                  })
                ))}
              </div>
              
              <div className="number-pad">
                <div className="row g-2 mb-3">
                  {['1', '2', '3', '4', '5'].map(num => (
                    <div className="col" key={num}>
                      <button
                        onClick={() => {
                          if (highlightedCell && !solving && !solved && originalBoard[highlightedCell.row][highlightedCell.col] === '.') {
                            const newBoard = [...board];
                            newBoard[highlightedCell.row][highlightedCell.col] = num;
                            setBoard(newBoard);
                          }
                        }}
                        className="btn btn-outline-dark w-100"
                        disabled={solving || solved}
                      >
                        {num}
                      </button>
                    </div>
                  ))}
                </div>
                <div className="row g-2">
                  {['6', '7', '8', '9', 'Clear'].map((num, index) => (
                    <div className="col" key={num}>
                      <button
                        onClick={() => {
                          if (highlightedCell && !solving && !solved && originalBoard[highlightedCell.row][highlightedCell.col] === '.') {
                            const newBoard = [...board];
                            if (index === 4) { // Clear button
                              newBoard[highlightedCell.row][highlightedCell.col] = '.';
                            } else {
                              newBoard[highlightedCell.row][highlightedCell.col] = num;
                            }
                            setBoard(newBoard);
                          }
                        }}
                        className={`btn ${index === 4 ? 'btn-outline-danger' : 'btn-outline-dark'} w-100`}
                        disabled={solving || solved}
                      >
                        {index === 4 ? <i className="bi bi-x-lg"></i> : num}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SudokuSolver;