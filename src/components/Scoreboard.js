import React from 'react';

const Scoreboard = ({ scores }) => {
  return (
    <div className="scoreboard">
      <div className="score">
        <span className="player-x">X</span>
        <span className="score-number">{scores.x}</span>
      </div>
      <div className="score">
        <span className="player-o">O</span>
        <span className="score-number">{scores.o}</span>
      </div>
      <div className="score">
        <span className="draws">Draws</span>
        <span className="score-number">{scores.ties}</span>
      </div>
    </div>
  );
};

export default Scoreboard;
