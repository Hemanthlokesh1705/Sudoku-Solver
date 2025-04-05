import React, { useState, useEffect, useCallback } from 'react';
import SudokuBoard from './SudokuBoard';
import NumberPad from './NumberPad';
import GameControls from './GameControls';
import HowToPlay from './HowToPlay';
import { generatePuzzle, solveSudokuBoard, isValidBoard, checkSolutionValid } from './utils/sudokuLogic';
import { formatTime } from './utils/timerUtils';
import './App.css';

function App() {
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

  // ⬇️⬇️ Wrapped with useCallback to fix ESLint warning
  const startNewGame = useCallback(() => {
    setSolving(true);
    setError('');
    setSolved(false);
    setTimerRunning(false);
    setTimer(0);

    const puzzle = generatePuzzle(difficulty);
    setBoard(puzzle);
    setOriginalBoard(JSON.parse(JSON.stringify(puzzle)));
    setTimerRunning(true);
    setSolving(false);
  }, [difficulty]);

  const handleCellChange = (row, col, value) => {
    if (originalBoard[row][col] === '.' && !solved) {
      if (value === '' || (value >= '1' && value <= '9')) {
        const newBoard = [...board];
        newBoard[row][col] = value === '' ? '.' : value;
        setBoard(newBoard);
      }
    }
  };

  const resetBoard = () => {
    setBoard(JSON.parse(JSON.stringify(originalBoard)));
    setSolved(false);
    setError('');
  };

  const clearBoard = () => {
    setBoard(Array(9).fill().map(() => Array(9).fill('.')));
    setOriginalBoard(Array(9).fill().map(() => Array(9).fill('.')));
    setSolved(false);
    setError('');
    setTimerRunning(false);
    setTimer(0);
  };

  const solvePuzzle = () => {
    setError('');
    setSolving(true);

    if (!isValidBoard(board)) {
      setError('Invalid board configuration');
      setSolving(false);
      return;
    }

    const boardCopy = JSON.parse(JSON.stringify(board));
    const result = solveSudokuBoard(boardCopy);

    if (result) {
      setBoard(boardCopy);
      setSolved(true);
      setTimerRunning(false);
    } else {
      setError('No solution exists for this board configuration');
    }

    setSolving(false);
  };

  const checkSolution = () => {
    const result = checkSolutionValid(board);

    if (result.valid) {
      setSolved(true);
      setTimerRunning(false);
      setError('');
    } else {
      setError(result.error);
    }
  };

  // ✅ Now safe with useCallback wrapped
  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  return (
    <div className="sudoku-app">
      <div className="app-header">
        <h1>Sudoku Challenge</h1>
        <p>Generate, play, and solve Sudoku puzzles</p>
      </div>

      <div className="app-content">
        <div className="game-panel">
          <GameControls 
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            solving={solving}
            solved={solved}
            timerRunning={timerRunning}
            timer={timer}
            formatTime={formatTime}
            startNewGame={startNewGame}
            checkSolution={checkSolution}
            resetBoard={resetBoard}
            solvePuzzle={solvePuzzle}
            clearBoard={clearBoard}
          />

          {error && (
            <div className="error-message">
              <i className="error-icon"></i>
              {error}
            </div>
          )}

          {solved && (
            <div className="success-message">
              <i className="trophy-icon"></i>
              Puzzle solved! Great job!
            </div>
          )}

          <HowToPlay />
        </div>

        <div className="board-container">
          <div className="board-wrapper">
            <h2>Sudoku Board</h2>
            <SudokuBoard 
              board={board}
              originalBoard={originalBoard}
              solving={solving}
              solved={solved}
              highlightedCell={highlightedCell}
              setHighlightedCell={setHighlightedCell}
              handleCellChange={handleCellChange}
            />

            <NumberPad 
              highlightedCell={highlightedCell}
              solving={solving}
              solved={solved}
              originalBoard={originalBoard}
              handleCellChange={handleCellChange}
              board={board}
              setBoard={setBoard}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
