import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import { RxCross2 } from "react-icons/rx";

import { baseUrl } from '../utils/url.js';

const LeaderBoard = () => {
  const [game, setGame] = useState('chess');
  const [sortBy, setSortBy] = useState('win');

  // Get a leaderboard from backend based on given sorting
  const { data } = useQuery({
    queryKey : ["leaderBoard", game, sortBy],
    queryFn : async () => {
      try {
        const res = await fetch(`${baseUrl}/api/rank/leaderboard?game=${game}&sortBy=${sortBy}`,{
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type" : "application/json"
          }
        })
        const data = await res.json();
        if(!res.ok){
          throw new Error(data.error || "something went wrong")
        }
        console.log(data)
        return data;
      } catch (error) {
        throw error;
      }
    }
  });

  return (
    <div className='flex min-h-screen h-auto w-screen bg-blue-200 flex-col p-[5%] itmes-center'>
      <div className='flex justify-between'>
      <h1 className='font-bold font-serif text-lg md:text-2xl lg:text-4xl'>LeaderBoard</h1>
        <button onClick={(e)=>{
          e.preventDefault();}} className='flex justify-end font-bold font-serif text-lg md:text-2xl lg:text-4xl'>
          <Link to="/">
            <RxCross2 />
          </Link>
        </button>
      </div>
      <div className='flex justify-between'>
        <label className='font-bold font-serif text-base md:text-xl lg:text-3xl'>Choose Game:</label>
        <select value={game} onChange={(e)=> setGame(e.target.value)} className='bg-transparent font-bold font-serif text-base md:text-xl lg:text-3xl'>
          <option value="chess">Chess</option>
        </select>
        <label className='font-bold font-serif text-base md:text-xl lg:text-3xl'>Sort By:</label>
        <select value={sortBy} onChange={(e)=> setSortBy(e.target.value)} className='bg-transparent font-bold font-serif text-base md:text-xl lg:text-3xl'>
          <option value="win">Win</option>
          <option value="totalMatch">Total Match</option>
        </select>
      </div>
      {data && (
        <div className='tableContainer'>
          <table className='tableSet'>
            <thead className='tableHeader'>
              <tr className='tableRow'>
                <th className='tableHead rankColumn'>Rank</th>
                <th className='tableHead playerNameColumn'>Player Name</th>
                <th className='tableHead totalMatchesColumn'>Total Matches</th>
                <th className='tableHead winsColumn'>Wins</th>
              </tr>
            </thead>
            <tbody className='tableBody'>
              {data.map((player, index) => (
                <tr key={player._id} className='tableRow'>
                  <td className='tableData rankColumn'>{index + 1}</td>
                  <td className='tableData playerNameColumn'>{player.playername}</td>
                  <td className='tableData totalMatchesColumn'>{player.games[game].totalMatch}</td>
                  <td className='tableData winsColumn'>{player.games[game].win}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default LeaderBoard