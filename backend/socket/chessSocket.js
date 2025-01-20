import {Chess} from 'chess.js';
import Player from '../models/playerModel.js';

const socketPlayerMap = {};

const games = {};

let No_Player = 1;

export default (socketIO) => {
const chessNamespace = socketIO.of('/');
chessNamespace.on("connection", (socket)=>{
  console.log(`User connected: ${socket.id}`);

  let currentGameId = null;

  let duplicateId = "";

  // Join a game
  socket.on('joinGame', (gameId) => {
    currentGameId = gameId;
    if (!games[gameId]) {
      games[gameId] = new Chess();  // Initialize new chess game if not exists
    }
    socket.join(gameId);
    const game = games[gameId];
    var color = "";
    if(No_Player%2===0){
      color = "black"
    }else{
      color = "white"
    } // Assign color based on turn
    if(duplicateId === gameId){
      return
    }else{
      duplicateId = gameId;
      console.log(No_Player) // check how player in those room
      No_Player += 1;
    }
    socket.emit('color', color);  // Emit the player's color
    socket.emit('update', game.fen()); // Send the current FEN
    console.log(`User ${socket.id} joined game ${gameId} as ${color}`);
  });

  socket.on('userLogin', async (userId) => {
    try{
      const player = await Player.findOne({_id: userId}).select("-password"); // check given id is here in database or not
      if(!player){
        console.error("player not found");
        return;
      }
      else{
        socketPlayerMap[socket.id]= userId; // store players details in object using their socket id
        console.log(`Player ${player.playername} is logged in with socket ${socket.id}`);
      }
      console.log('success')
    }catch(error){
      console.log("error from getMe",error);
    }
  })

  socket.on('moves', (gameId, move, Fen) => {
    console.log(`${gameId} moved ${move}`); // get a move
    const game = games[gameId];
    if (game) {
      const result = game.move(move);
      if (result) {
        chessNamespace.to(gameId).emit('move', move, Fen); // return those details back to another clients
      } else {
        console.error('Invalid move:', move);
      }
    }
  });

  socket.on('captures',(gameId,target,color) =>{
    // return captured pieces details to everyone in room except who captured that
    chessNamespace.in(gameId).fetchSockets().then((sockets)=>{
      sockets.forEach((s)=>{
        if(s.id !== socket.id){
          s.emit('capture',target,color);
        }
      })
    })
  })

  socket.on('gameEnd',( gameId, winner)=>{
    // return message of game over and who win the match
    chessNamespace.in(gameId).fetchSockets().then((sockets)=>{
      sockets.forEach((s)=>{
          s.emit('gameOver',winner);
      });

      // get player details
      const lastTwoSockets = sockets.slice(-2);

      const blackPlayerId = lastTwoSockets[0].id;
      const whitePlayerId = lastTwoSockets[1].id;

      // get players details from database using socket id
      const blackUserId = socketPlayerMap[blackPlayerId]
      const whiteUserId = socketPlayerMap[whitePlayerId]

      if(!blackUserId || !whiteUserId) {
        console.error('Player IDs are missing');
        return;
      };

      // update a detail of total matches and wins in database
      Player.updateMany(
        { _id: {$in: [blackUserId, whiteUserId]}},
        { $inc: {'games.chess.totalMatch':1}}
      ).then(()=>{
        console.log('Total matches updated successfully');
      
        // find a winner and store wins in that player database
        if(winner)
        {
          const winnerId = winner === 'black' ? blackUserId : whiteUserId;

          Player.updateOne(
            {_id: winnerId},
            {$inc: {'games.chess.win':1}}
          ).then(()=>{
            console.log('winner stats updated successfully')
          }).catch(err =>
            console.error("error update winner stats:",err)
          );
        }else{
          console.log("This match is draw")
        }

      }).catch(err => console.log("error updating total matches:",err))
    })
  })

  // disconnect the player if they leave
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});
};

