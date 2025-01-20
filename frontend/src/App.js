import React from "react";
import { Routes, Route, Navigate } from "react-router-dom"; //make route
import {Toaster} from 'react-hot-toast'; //alert message
import { useQuery } from "@tanstack/react-query"; //connect frontend and backend

// Main pages
import HomePage from "./pages/HomePage.js";
import SignUpPage from "./pages/SignUpPage.js";
import LoginPage from "./pages/LoginPage.js";

// Navbar pages
import ProfilePage from "./pages/profile/ProfilePage.js";
import LeaderBoard from "./pages/LeaderBoard.js";
import Setting from "./pages/Setting.js";
import EditProfileModal from "./pages/profile/EditProfileModal.js";

// Games components
import ChessGame from "./components/ChessGame.js";
import TicTacToe from "./components/TicTacToe.js";

// Extra
import { baseUrl } from "./utils/url.js";
import LoadingSpinner from "./components/common/LoadingSpinner.js";

// Styles
import './styles/index.css';


const App = () => {
  const development = false; //development configures

  // Get a data from backend getme
  const {data : authUser, isLoading} = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch(`${baseUrl}/api/auth/me`,{
          method: "GET",
          credentials: "include", // For production of our cookies
          headers: {
            "Content-Type" : "application/json"
          }
        })
        const data = await res.json();
        if(data.error){
          return null;
        }
        if(!res.ok){
          throw new Error(data.error || "something went wrong")
        }
        return data;
      } catch (error) {
        throw error;
      }
    },
    retry : false
  })

  // Wait until get details
  if(isLoading){
    return(
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg"/>
      </div>
    )
  }

  return (
    <div className="app h-screen w-screen">
      <Routes>
        <Route path="/" element={authUser || development ? <HomePage/> : <Navigate to="/login"/>}/>
        <Route path="/signup" element={!authUser || development ? <SignUpPage /> : <Navigate to="/"/>}/>
        <Route path="/login" element={!authUser || development ? <LoginPage /> : <Navigate to="/"/>}/>
        <Route path='/profile/:username' element={authUser || development ? <ProfilePage /> : <Navigate to="/login"/>}/>
        <Route path='/profile/edit' element={authUser || development ? <EditProfileModal /> : <Navigate to="/login"/>}/>
        <Route path="/leaderboard/:username" element={authUser || development ? <LeaderBoard />: <Navigate to="/login"/>}/>
        <Route path="/setting" element={authUser || development ? <Setting /> : <Navigate to="/login"/>}/>
        <Route path="/chess/:id" element={authUser || development ? <ChessGame/> : <Navigate to="/login"/>}/>
        <Route path="/tictactoe/:id" element={authUser || development ? <TicTacToe/> : <Navigate to="/login"/>}/>
      </Routes>
      <Toaster/>
    </div>
  );
};

export default App;
