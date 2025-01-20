import React, { useState, useEffect } from "react";
import { useLocation, Link, useParams } from "react-router-dom";

import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { io } from "socket.io-client"; // Use socket in frontend

import { url } from "../utils/url.js"; // For connect socket with frontend

const socket = io(`${url}`);

//piecesSymbols for show in the captured pieces
const pieceSymbols = {
  p: "♙",
  r: "♖",
  n: "♘",
  b: "♗",
  q: "♕",
  k: "♔",
  P: "♟",
  R: "♜",
  N: "♞",
  B: "♝",
  Q: "♛",
  K: "♚"
};

const ChessGame = () => {
  const location = useLocation();
  const { gameMode, gameId } = location.state || { gameMode: "local", gameId: null };

  const [game, setGame] = useState(new Chess());
  const [turn, setTurn] = useState("white");
  const [capturedPieces, setCapturedPieces] = useState({ white: [], black: [] });
  const [playerColor, setPlayerColor] = useState("white");
  const [isGameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState("");

  const {id} = useParams(); //get database id from url
  const userId = id;

  // Check mode is vsAi or not
  useEffect(() => {
    if (gameMode === "vsAI" && turn === "black") {
      makeAIMove();
    }
  }, [turn, gameMode]);

  // Online game with socket
  useEffect(() => {
    socket.emit('joinGame', gameId);

    socket.emit('userLogin', userId);

    socket.on('color', (color) => {
      setPlayerColor(color);  // Set player's color
      setTurn(color === 'white' ? 'white' : 'black');
    });

    // Pass every update in game
    socket.on('update', (Fen) => {
      const newGame = new Chess(Fen);
      setGame(newGame);
      setTurn(newGame.turn() === 'w' ? 'white' : 'black');
    });

    socket.on('move', (move,Fen) => {
      // Handle move by the opponent
      const gameCopy = new Chess(Fen);
      gameCopy.move(move);
      setGame(gameCopy);
      setTurn(gameCopy.turn() === 'w' ? 'white' : 'black');
    });

    socket.on('capture',  (target, color) => {
      // Handle capture item by the opponent
      setCapturedPieces((prev) => ({
        ...prev,
        [color]: [...prev[color], pieceSymbols[target]],
      }));
    })

    // Handle gameover and throw a winner
    socket.on('gameOver', (winner) => {
      setGameOver(true);
      setWinner(winner);
    });

    return () => {
      socket.off('color');
      socket.off('update');
      socket.off('capture');
      socket.off('move');
      socket.off('gameOver');
    };
  }, [gameId]);

  //AI moves and play
  const makeAIMove = () => {
    const moves = game.moves();
    console.log(moves)
    if(moves.length === 0){
      setWinner("white");
    } else  {
      const move = moves[Math.floor(Math.random() * moves.length)];
    
      game.move(move);
      let AImove = game.history({ verbose: true }).pop();
      handleCapture(AImove);

      setGame(new Chess(game.fen()));
      setTurn("white");
      
      const gameCopyAgain = new Chess(game.fen());
      if(gameCopyAgain.isGameOver() || game.isCheckmate() ){
        setGameOver(true);
        let gameWinner = ""
        if(gameCopyAgain.isCheckmate()){
          const losingPlayer = gameCopyAgain.turn();
          gameWinner = losingPlayer === "w" ? "Black" : "White";
          setWinner(gameWinner);
        }else{
          setWinner("It's a draw");
        }
        if(gameMode === "online" && gameId){
          socket.emit('gameEnd', gameId, gameWinner)
        }
      }
    }
  };

  // Change game player turn
  useEffect(() => {
    setTurn(game.turn() === "w" ? "white" : "black");
  }, [game]);

  // Check a pieces drop from and to for make move
  const onDrop = (sourceSquare, targetSquare) => {
    try {
      const gameCopy = new Chess(game.fen());

      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q',
      });

      if (move === null) throw new Error("Illegal move");

      // If it's online check vaild moves
      if (gameMode === "online" && gameId) {
        if (playerColor !== turn) {
          throw new Error("Not your turn");
        }
        if ((playerColor === "white" && move.color !== "w") || (playerColor === "black" && move.color !== "b")) {
          throw new Error("Cannot move opponent's pieces");
        }
      }

      handleCapture(move); //  Handle captured pieces
      setGame(gameCopy); // Set a game current state

      setTurn(gameCopy.turn() === "w" ? "white" : "black"); // Set a player turn

      // If a game is online emit to the backend
      if (gameMode === "online" && gameId) {
        socket.emit('moves',  gameId, move,game.fen());
      }

      // Find a game is over or not
      if(gameCopy.isGameOver()){
        setGameOver(true);
        let gameWinner = ""
        if(gameCopy.isCheckmate()){
          const losingPlayer = gameCopy.turn();
          gameWinner = losingPlayer === "w" ? "Black" : "White";
          setWinner(gameWinner);
        }else{
          setWinner("It's a draw");
          gameWinner = "";
        }
        
        // If it's online emit result
        if(gameMode === "online" && gameId){
          socket.emit('gameEnd', gameId, gameWinner)
        }
      }
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  };

  // Check a move is valid or not
  const getLegalMoves = (square) => {
    const moves = game.moves({ square, verbose: true });
    return moves.map(move => move.to);
  };

  // Handle a pawn promotion
  const handlePromotion = (promotionType, promoteFromSquare, promoteToSquare) => {
    let promotionPiece = 'q';
    if (promotionType === 'wQ' || promotionType === 'bQ') {
      promotionPiece = 'q';
    } else if (promotionType === 'wR' || promotionType === 'bR') {
      promotionPiece = 'r';
    } else if (promotionType === 'wB' || promotionType === 'bB') {
      promotionPiece = 'b';
    } else if (promotionType === 'wN' || promotionType === 'bN') {
      promotionPiece = "n";
    } else {
      console.log(`error: ${promotionType}`)
    }

    // Save a that promotion move
    const gameCopy = new Chess(game.fen());
    const move = gameCopy.move({
      from: promoteFromSquare,
      to: promoteToSquare,
      promotion: promotionPiece,
    });

    // Handle capture if happen before promotion
    handleCapture(move);

    // Handle Gameover if happen after promotion
    if(gameCopy.isGameOver()){
      setGameOver(true);
      let gameWinner = ""
      if(gameCopy.isCheckmate()){
        const losingPlayer = gameCopy.turn();
        gameWinner = losingPlayer === "w" ? "Black" : "White";
        setWinner(gameWinner);
      }else{
        setWinner("It's a draw");
      }
      if(gameMode === "online" && gameId){
        socket.emit('gameEnd', gameId, gameWinner)
      }
    }

    // Emit to the backend
    if (gameMode === "online" && gameId) {
      socket.emit('moves',  gameId, move,game.fen());
    }

    if (move === null) {
      console.error("Illegal promotion move");
      return;
    }

    setGame(gameCopy);
  };

  // Handle a captured pieces data
  const handleCapture = (move) => {
    let target = move.captured;
    if (target) {
      const color = move.color === 'w' ? 'white' : 'black';
      if (move.color === 'w') {
        target = target.toUpperCase();
      } else {
        target = target.toLowerCase();
      }

      setCapturedPieces((prev) => ({
        ...prev,
        [color]: [...prev[color], pieceSymbols[target]],
      }));

      // Emit to the backend
      if (gameMode === "online" && gameId) {
        socket.emit('captures',  gameId, target, color);
      }
    }
  };

  const CapturedPieces = ({ pieces }) => {
    return (
      <div className="text-lg md:text-2xl lg:text-4xl flex flex-wrap">
        {pieces.map((piece, index) => (
          <div key={index}>{piece}</div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen h-auto w-screen flex items-center justify-center flex-col bg-blue-300 gap-[5%]">
      <h1 className="font-bold font-serif text-lg md:text-2xl lg:text-4xl">chess game</h1>
      {isGameOver ? (
        <div className="flex items-center justify-center flex-col">
          <h2 className="font-bold font-serif text-lg md:text-2xl lg:text-4xl">Game Over</h2>
          <h3 className="font-bold font-serif text-lg md:text-2xl lg:text-4xl">{winner}</h3>
          <button className="btn rounded-full bg-blue-500 text-white text-sm sm:text-sm md:text-base lg:text:lg font-serif shadow-md hover:bg-blue-600 active:bg-blue-700 border-0">
            <Link to='/'>Home</Link>
          </button>
        </div>
      ) : (
        <div className= "flexible-container w-screen">
          <div className="chessboard border-2 border-cyan-700 w-[80vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] xl:w-[30vw] aspect-w-1 aspect-h-1">
            <Chessboard
              position={game.fen()}
              onPieceDrop={onDrop}
              getLegalMoves={getLegalMoves}
              onPromotionPieceSelect={handlePromotion}
            />
          </div>
          <div className="pieces-container">
            <div className="captured-pieces black-captured">
              <h4 className="font-bold font-serif text-lg md:text-2xl lg:text-4xl">Black Captured:</h4>
              <CapturedPieces pieces={capturedPieces.black} />
            </div>
            <div className="turn font-bold font-serif text-lg md:text-2xl lg:text-4xl">
              {gameMode === "online" && <h2>Your Color: {playerColor} </h2>}
              <h2>Turn: {turn}</h2>
            </div>
            <div className="captured-pieces white-captured">
              <h4 className="font-bold font-serif text-lg md:text-2xl lg:text-4xl">White Captured:</h4>
              <CapturedPieces pieces={capturedPieces.white} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChessGame;