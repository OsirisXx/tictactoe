import { useState, useEffect } from 'react';
import Scoreboard from './components/Scoreboard.tsx';
import GridBackground from './components/GridBackground.tsx';
import './App.css';

type SquareValue = 'X' | 'O' | null;

interface SquareProps {
  value: SquareValue;
  onSquareClick: () => void;
}

function Square({ value, onSquareClick }: SquareProps) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

interface BoardProps {
  xIsNext: boolean;
  squares: SquareValue[];
  onPlay: (squares: SquareValue[]) => void;
}

function Board({ xIsNext, squares, onPlay }: BoardProps) {
  const [scores, setScores] = useState({ x: 0, o: 0, ties: 0 });
  const [announcement, setAnnouncement] = useState<string>('');

  function checkDraw(squares: SquareValue[]): boolean {
    return squares.every(square => square !== null) && !calculateWinner(squares);
  }

  useEffect(() => {
    if (checkDraw(squares)) {
      setScores(prev => ({ ...prev, ties: prev.ties + 1 }));
      setAnnouncement('It\'s a draw!');
    }
  }, [squares]);

  function handleClick(i: number) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    
    // Clear announcement when starting a new move
    setAnnouncement('');
    
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    
    const winner = calculateWinner(nextSquares);
    if (winner) {
      const newScores = { ...scores };
      winner === 'X' ? newScores.x++ : newScores.o++;
      setScores(newScores);
      setAnnouncement(`Player ${winner} wins!`);
    }

    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <Scoreboard scores={scores} />
      <div className="status">{status}</div>
      <div className="announcement">{announcement}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares: SquareValue[]) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: number) {
    // Clear history when starting new game
    if (nextMove === 0) {
      setHistory([Array(9).fill(null)]);
      setCurrentMove(0);
    } else {
      setCurrentMove(nextMove);
    }
    // Clear the announcement
    const board = document.querySelector('.game-board');
    if (board) {
      const announcementElement = board.querySelector('.announcement');
      if (announcementElement) {
        announcementElement.textContent = '';
      }
    }
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = `Move ${move}`;
    } else {
      description = 'Start Game';
    }
    return (
      <li key={move} className="history-item">
        <button 
          className={`history-button ${move === currentMove ? 'active' : ''}`}
          onClick={() => jumpTo(move)}>
          {description}
        </button>
      </li>
    );
  });

  return (
    <>
      <GridBackground />
      <div className="game">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        <div className="game-info">
          <ol>{moves}</ol>
        </div>
      </div>
    </>
  );
}

function calculateWinner(squares: SquareValue[]): SquareValue {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
