import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

import '../styles/index.css';

let roundCount = 1;

// Make a squres for board
const Square = ({ value, onClick }) => {
  return (
    <button className="square text-black" onClick={onClick}>
      {value}
    </button>
  );
};

// Make a board
const Board = ({ squares, onClick }) => {
  return (
    <div>
      <div className="board-row">
        {squares.slice(0, 3).map((square, i) => (
          <Square key={i} value={square} onClick={() => onClick(i)} />
        ))}
      </div>
      <div className="board-row">
        {squares.slice(3, 6).map((square, i) => (
          <Square key={i} value={square} onClick={() => onClick(i + 3)} />
        ))}
      </div>
      <div className="board-row">
        {squares.slice(6, 9).map((square, i) => (
          <Square key={i} value={square} onClick={() => onClick(i + 6)} />
        ))}
      </div>
    </div>
  );
};

const TicTacToe = () => {

    const location = useLocation();
    const { gameMode} = location.state || { gameMode: "local"};
    const [squares, setSquares] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [xWins, setXWins] = useState(0);
    const [oWins, setOWins] = useState(0);
    const [ties, setTies] = useState(0);
    const [matchCount, setMatchCount] = useState(0);
    const [overallWinner, setOverallWinner] = useState(null);
    const [isGameOver, setGameOver] = useState(false);

  // Handle a Winner
  useEffect(() => {
    const winner = calculateWinner(squares);
    if (winner || squares.every(square => square !== null)) {
      handleNewMatch(winner);
    } else if (gameMode === 'vsAI' && !isXNext) {
      makeAIMove();
    }
  }, [squares, isXNext, gameMode]);

  // Handle game play
  const handleClick = (i) => {
    const newSquares = squares.slice();
    if (calculateWinner(squares) || squares[i] || (gameMode === 'ai' && !isXNext)) {
      return;
    }
    newSquares[i] = isXNext ? 'X' : 'O';
    setSquares(newSquares);
    setIsXNext(!isXNext);
  };

  // AI move
  const makeAIMove = () => {
    const emptySquares = squares.map((square, i) => square === null ? i : null).filter(i => i !== null);
    const randomIndex = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    const newSquares = squares.slice();
    newSquares[randomIndex] = 'O';
    console.log("true")
    setSquares(newSquares);
    setIsXNext(true);
  };

  // Restart match again
  const handleNewMatch = (winner) => {
    if (winner) {
      if (winner === 'X') {
        setXWins(xWins + 1);
      } else {
        setOWins(oWins + 1);
      }
    } else {
      setTies(ties + 1);
    }
    setMatchCount(matchCount + 1);
    roundCount = roundCount + 1;
  };

  // Make 7 rounds
  useEffect(()=>{
    if (roundCount <= 7) {
      setSquares(Array(9).fill(null));
      setIsXNext(true);
    } else {
      determineOverallWinner();
    }
  }, [matchCount]);

  // Determine winner
  const determineOverallWinner = () => {
    if (xWins > oWins) {
      setOverallWinner('X');
      roundCount = 1;
      setGameOver(true);
    } else if (oWins > xWins) {
      setOverallWinner('O');
      roundCount = 1;
      setGameOver(true);
    } else {
      setOverallWinner("It's draw");
      roundCount = 1;
      setGameOver(true);
    }
  };

  // calculate a winner in each round
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (isXNext ? 'X' : 'O');
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center flex-col bg-blue-300">
      <div className="h-screen w-screen flex items-center justify-center flex-col bg-blue-300 gap-[5%]">
        <h1 className="font-bold font-serif text-lg md:text-2xl lg:text-4xl text-black">TicTacToe Game</h1>
        {isGameOver ? (
          <div className="flex items-center justify-center flex-col">
            <h2 className="font-bold font-serif  text-black text-lg md:text-2xl lg:text-4xl">Game Over</h2>
            <h3 className="font-bold font-serif  text-black text-lg md:text-2xl lg:text-4xl">{overallWinner}</h3>
            <button className="btn rounded-full bg-blue-500 text-black text-sm sm:text-sm md:text-base lg:text:lg font-serif shadow-md hover:bg-blue-600 active:bg-blue-700 border-0">
              <Link to='/'>Home</Link>
            </button>
          </div>
        ) : (
        <div className='flexible-container w-screen'>
          <div className="game-board w-[80vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] xl:w-[30vw] aspect-w-1 aspect-h-1">
            <Board squares={squares} onClick={handleClick} />
          </div>
          <div className="info-container">
            <h3 className="font-bold font-serif text-black text-lg md:text-2xl lg:text-4xl">{status}</h3>
            <h4 className="font-bold font-serif text-black text-lg md:text-2xl lg:text-4xl">X Wins: {xWins}</h4>
            <h4 className="font-bold font-serif text-black text-lg md:text-2xl lg:text-4xl">O Wins: {oWins}</h4>
            <h4 className="font-bold font-serif text-black text-lg md:text-2xl lg:text-4xl">Ties: {ties}</h4>
            <h4 className="font-bold font-serif text-black text-lg md:text-2xl lg:text-4xl">Matches Played: {matchCount}</h4>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

// Winner rule to calculate
const calculateWinner = (squares) => {
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
};

export default TicTacToe;