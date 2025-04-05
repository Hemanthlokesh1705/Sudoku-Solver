import React from 'react';

function HowToPlay() {
  return (
    <div className="how-to-play">
      <h2>How to Play</h2>
      <ul>
        <li>Select difficulty and click "New Game" to generate a random puzzle</li>
        <li>Click a cell and enter numbers or use the number pad below</li>
        <li>Use "Check Solution" to verify your answer</li>
        <li>Use "Reset" to start over with the same puzzle</li>
        <li>Use "Solve For Me" if you get stuck</li>
      </ul>
    </div>
  );
}

export default HowToPlay;