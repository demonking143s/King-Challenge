import express from 'express'; //import express
import dotenv from 'dotenv'; //import .env file
import cors from 'cors'; //cors for middleware to connect backend and frontend
import cookieParser from 'cookie-parser'; //security with cookies
import {Server} from 'socket.io'; //connect two clients
import http from 'http'; //make server
import path from 'path'; //get a running port
import { fileURLToPath } from 'url'; //get url

import connectDB from './db/connectDB.js'; //connect database to the server
import authRoute from './routes/authRoute.js'; //route for authentication
import userRoute from  './routes/userRoute.js'; //route for user deatails
import rankRoute from './routes/rankRoute.js'; //route for leaderboard
import chessSocket from './socket/chessSocket.js'; //connect socket in chess

// Run a server and find port
dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); //connect url with project folder

// Middleware to parse JSON bodies
app.use(express.json());

// Connect backend and frontend
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// Middleware for read cookies
app.use(cookieParser());

// Find a url
app.use(express.urlencoded(
  {
    extended: true
  }
))

// Connect a databse
connectDB();

// Running port
const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoute); // Route for authentication
app.use("/api/user", userRoute); // Route for user deatils
app.use("/api/rank", rankRoute); // Route for leaderboard

// Create a server
const server = http.createServer(app);

// Connect server and frontend
const io = new Server(server, {
  cors:{
    origin:"http://localhost:3000",
    methods: [ 'POST','GET'],
    credentials: true,
  },
})

// Call a socket fuction
chessSocket(io);

// Production configuration to join a frontend build with backend
if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname,"../frontend/build")))

  app.use("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"../frontend/build","index.html"))
    console.log(`${req.method} ${req.url}`) //check error when serve frontend files
  })
}

// Run a server
app.listen(PORT,()=>{
  console.log(`The server is running on port: http://localhost:${PORT}`)
})