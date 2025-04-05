import React from 'react';

function NumberPad({ 
  highlightedCell, 
  solving, 
  solved, 
  originalBoard, 
  board, 
  setBoard 
}) {
  // Handle clicking a number on the number pad
  const handleNumberClick = (value) => {
    if (highlightedCell && !solving && !solved && 
        originalBoard[highlightedCell.row][highlightedCell.col] === '.') {
      const newBoard = [...board];
      if (value === 'clear') {
        newBoard[highlightedCell.row][highlightedCell.col] = '.';
      } else {
        newBoard[highlightedCell.row][highlightedCell.col] = value;
      }
      setBoard(newBoard);
    }
  };

  return (
    <div className="number-pad">
      <div className="number-row">
        {['1', '2', '3', '4', '5'].map(num => (
          <button
            key={num}
            onClick={() => handleNumberClick(num)}
            className="num-button"
            disabled={solving || solved}
          >
            {num}
          </button>
        ))}
      </div>
      <div className="number-row">
        {['6', '7', '8', '9'].map(num => (
          <button
            key={num}
            onClick={() => handleNumberClick(num)}
            className="num-button"
            disabled={solving || solved}
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => handleNumberClick('clear')}
          className="clear-button"
          disabled={solving || solved}
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export default NumberPad;