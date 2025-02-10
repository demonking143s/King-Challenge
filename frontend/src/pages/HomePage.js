import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';

import { useQuery } from "@tanstack/react-query";

// React icons
import { TbSettings } from "react-icons/tb";
import { VscGraph } from "react-icons/vsc";
import { IoPersonCircleSharp } from "react-icons/io5";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { HiOutlineLightBulb } from "react-icons/hi";

// Import images
import chessImage from '../images/king.jpeg';
import XOImage from '../images/tictactoe.jpeg';

// Specific style for homepage
import '../styles/homepage.css';

const HomePage = () => {
  const [gameName, setGameName] = useState(null);
  const [showButton, setShowButton] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  // Array define
  const images = [chessImage, XOImage];
  const games = ["chess", "tictactoe"];
  const onlineAccesers = ["chess"];

  // Call a function
  const{ data: authUser } = useQuery({
    queryKey : ["authUser"],
  })

  // Handle mode online / vsAI /  local
  const handleModeSelection = (selectedMode) => {
    if (selectedMode === "online") {
      generateGameId();
      return;
    }
    console.log("mode")
    navigate(`/${gameName}/${authUser._id}`, { state: { gameMode: selectedMode } });
  };

  // Throw a overlay
  const generateGameId = () => {
    document.querySelector('.overlay').style.display = 'flex';
  };

  // Check that game have online access
  const handleGameSelection = (selectedGame) => {
    setGameName(selectedGame);
    if(onlineAccesers.includes(selectedGame)){
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  // Game room process
  const handleInputChange = (e) => {
    setRoomId(e.target.value);
  };

  const enterRoom = (e) => {
    e.preventDefault();
    console.log("welcome to room", roomId)
    navigate(`/${gameName}/${authUser._id}`, { state: { gameMode: "online", gameId: roomId } });
  };

  // Image change functions
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  // Selete a mode vsAI / local / online
  const modeOption = () => (
    <div className="modeOptions w-1/2">
      <button onClick={() => handleModeSelection("vsAI")} className='btn rounded-full text-white btn-active text-m mb-6'>
        vs AI
      </button>
      <button onClick={() => handleModeSelection("local")} className='btn rounded-full text-white btn-active text-m mb-6'>
        Local
      </button>
      {showButton ? (
      <button onClick={() => handleModeSelection("online")} className='btn rounded-full text-white btn-active text-m mb-6'>
        Online
      </button>
      ) : null}
    </div>
  );

  // Able to access homepage if user is logged in
  return (
    <div className="min-h-screen w-screen">
      {authUser && (
        <div className="homePage">
          <div className="navBar">
            <header className="header font-bold text-lg md:text-2xl lg:text-4xl font-serif">
              <h1 className="text-white">King Challenge</h1>
            </header>
            <div className="navBarProperties">
              <Link to={`/profile/${authUser.playername}`}><IoPersonCircleSharp className="text-[2em] mr-2"/></Link>
              <Link to={`/leaderboard/${authUser.playername}`}><VscGraph className="text-[2em] mr-2"/></Link>
              <Link to="/setting"><TbSettings className="text-[2em] mr-2"/></Link>
            </div>
          </div>
          <div className="gameImage">
            <img
              src={images[currentImageIndex]}
              alt={games[currentImageIndex]}
              style={{ width: "100%", height: "100%" }}
              onClick={() => handleGameSelection(games[currentImageIndex])}
            />
            {gameName === games[currentImageIndex] && modeOption()}
          </div>
          <div className="leftSideButton">
            <button onClick={handlePrevImage} className='btn bg-transparent border-0 text-yellow-400 rounded-full btn-active hover:text-yellow-500'>
              <FaArrowLeft className="text-m"/>
            </button>
          </div>
          <div className="rightSideButton">
            <button onClick={handleNextImage} className='btn bg-transparent border-0 text-yellow-400 rounded-full btn-active hover:text-yellow-500'>
              <FaArrowRight className="text-m"/>
            </button>
          </div>
          <div className="overlay flex justify-center items-center h-screen w-screen flex-col bg-blue-400">
            <div className="join max-w-sm mx-auto p-4 m-4 bg-blue-200 rounded-lg shadow-lg flex flex-col items-center">
              <h2 className="font-bold text-lg md:text-2xl lg:text-4xl font-serif text-black">ROOM</h2>
              <form onSubmit={enterRoom} className="place-content-center">
                <h2 className="font-serif text-lg md:text-2xl lg:text-4xl text-black">Enter ID:</h2>
                <input
                  type='text'
                  name='roomId'
                  onChange={handleInputChange}
                  value={roomId}
                  className="bg-white block sm:text-base md:text-lg text-black lg:text-xl border-blue-600 border-2"
                />
                <button type="submit" className="mt-2 bg-transparent border-0 font-serif text-black font-bold sm:text-base md:text-lg lg:text-xl">Submit</button>
              </form>
            </div>
            <p className="sm:text-base md:text-lg text-black lg:text-xl"><HiOutlineLightBulb /> share your room id to your friends for play with them</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;