import React from 'react';

function GameControls({ 
  difficulty, 
  setDifficulty, 
  solving, 
  timerRunning, 
  timer, 
  formatTime,
  startNewGame,
  checkSolution,
  resetBoard,
  solvePuzzle,
  clearBoard,
  solved
}) {
  return (
    <div className="game-controls">
      <div className="controls-header">
        <h2>Game Controls</h2>
        <div className="timer">{formatTime(timer)}</div>
      </div>
      
      <div className="controls-body">
        <div className="controls-row">
          <div className="difficulty-selector">
            <label htmlFor="difficulty">Difficulty:</label>
            <select 
              id="difficulty"
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
          
          <button
            onClick={startNewGame}
            disabled={solving}
            className="control-button new-game"
          >
            New Game
          </button>
        </div>
        
        <div className="controls-row">
          <button
            onClick={checkSolution}
            disabled={solving || solved}
            className="control-button check-solution"
          >
            Check Solution
          </button>
          
          <button
            onClick={resetBoard}
            disabled={solving}
            className="control-button reset"
          >
            Reset
          </button>
        </div>
        
        <div className="controls-row">
          <button
            onClick={solvePuzzle}
            disabled={solving}
            className="control-button solve"
          >
            Solve For Me
          </button>
          
          <button
            onClick={clearBoard}
            disabled={solving}
            className="control-button clear"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameControls;