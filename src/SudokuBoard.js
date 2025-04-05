import React from 'react';

function SudokuBoard({ 
  board,
  originalBoard,
  solving,
  solved,
  highlightedCell,
  setHighlightedCell,
  handleCellChange
}) {
  // Calculate cell styling based on position and state
  const getCellClass = (rowIndex, colIndex, value) => {
    const isOriginal = originalBoard[rowIndex][colIndex] !== '.';
    const isHighlighted = highlightedCell && 
                         (highlightedCell.row === rowIndex || 
                          highlightedCell.col === colIndex || 
                          (Math.floor(highlightedCell.row / 3) === Math.floor(rowIndex / 3) && 
                           Math.floor(highlightedCell.col / 3) === Math.floor(colIndex / 3)));
    const isSameValue = value !== '.' && highlightedCell && board[highlightedCell.row][highlightedCell.col] === value;
    
    let className = "sudoku-cell";
    
    if (rowIndex === highlightedCell?.row && colIndex === highlightedCell?.col) {
      className += " active";
    } else if (solved && !isOriginal) {
      className += " solved";
    } else if (isOriginal) {
      className += " original";
    } else if (isSameValue) {
      className += " same-value";
    } else if (isHighlighted) {
      className += " highlighted";
    }
    
    return className;
  };

  // Get border styling for grid visualization
  const getCellStyle = (rowIndex, colIndex) => {
    let style = {};
    
    // Thicker borders for 3x3 grid sections
    if ((rowIndex + 1) % 3 === 0 && rowIndex < 8) {
      style.borderBottom = '2px solid #555';
    }
    
    if ((colIndex + 1) % 3 === 0 && colIndex < 8) {
      style.borderRight = '2px solid #555';
    }
    
    return style;
  };

  return (
    <div className="sudoku-board">
      {board.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} className="sudoku-row">
          {row.map((cell, colIndex) => {
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
                style={getCellStyle(rowIndex, colIndex)}
                disabled={solving || isOriginal || solved}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default SudokuBoard;