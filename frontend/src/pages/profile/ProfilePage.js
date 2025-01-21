import React from 'react'
import { useParams, Link } from 'react-router-dom'

import { useQuery } from '@tanstack/react-query'

import { RxCross2 } from "react-icons/rx";
import { TbUserEdit } from "react-icons/tb";

import { baseUrl } from '../../utils/url.js'

const ProfilePage = () => {
  const {username} = useParams(); //get a username from url

  // Get a user profile from userRoute in backend
  const{ data: user }=useQuery({
    queryKey : ["userProfile"],
    queryFn : async () => {
      try {
        const res = await fetch(`${baseUrl}/api/user/profile/${username}`,{
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
        throw error
      }
    }
  })

  return (
    <div className='flex h-screen w-screen bg-blue-400 flex-col p-[5%] gap-[5%]'>
      <button onClick={(e)=>{
        e.preventDefault();}} className='flex justify-end text-black font-bold font-serif text-lg md:text-2xl lg:text-4xl'>
          <Link to="/">
            <RxCross2 />
          </Link>
        </button>
      {user && (
      <div className='flex flex-col relative'>
        <div>
          <h2 className='font-bold font-serif text-lg text-black md:text-2xl lg:text-4xl leading-loose'>Player</h2>
          <h3 className='font-bold font-serif text-sm text-black md:text-lg lg:text-2xl leading-relaxed'>Player Name:</h3>
          <h3 className='font-bold font-serif text-sm text-black md:text-lg lg:text-2xl leading-relaxed'>{user.playername}</h3>
          <h3 className='font-bold font-serif text-sm text-black md:text-lg lg:text-2xl leading-relaxed'>Email id:</h3>
          <h3 className='font-bold font-serif text-sm text-black md:text-lg lg:text-2xl leading-relaxed'>{user.email}</h3>
        </div>
        <hr className='text-blue-950'></hr>
        <div>
          <h2 className='font-bold font-serif text-lg md:text-2xl lg:text-4xl leading-loose'>Games</h2>
          <div>
            <h2 className='font-bold font-serif text-sm text-black md:text-lg lg:text-2xl leading-relaxed'>Chess</h2>
            <h3 className='font-bold font-serif text-xm text-black md:text-base lg:text-xl leading-normal'>Total Matches:</h3>
            <h3 className='font-bold font-serif text-xm text-black md:text-base lg:text-xl leading-normal'>{user.games['chess'].totalMatch}</h3>
            <h3 className='font-bold font-serif text-xm text-black md:text-base lg:text-xl leading-normal'>Wins:</h3>
            <h3 className='font-bold font-serif text-xm text-black md:text-base lg:text-xl leading-normal'>{user.games['chess'].win}</h3>
          </div>
        </div>
        <div className='absolute bottom-0 right-0 font-bold text-black font-serif text-lg md:text-2xl lg:text-4xl m-[5%]'>
          <button className='fixed'>
            <Link to="/profile/edit"><TbUserEdit /></Link>
          </button>
        </div>
      </div>
      )}
    </div>
  )
}

export default ProfilePage;