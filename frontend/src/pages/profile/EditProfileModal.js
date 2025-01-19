import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { RxCross2 } from "react-icons/rx";

import { baseUrl } from '../../utils/url.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.js';

const EditProfileModal = () => {

  // Edit a current profile
  const [formData, setFormData] = useState({
    email: "",
    playername: "",
    currentPassword: "",
    newPassword: "",
  });

  const navigate = useNavigate();

  const queryClient = useQueryClient();
  

  // Give details for edit a profile
  const {mutate : updateProfile, isPending, isError , error} = useMutation({
    mutationFn: async ({email, playername, password}) => {
        try {
            const res = await fetch(`${baseUrl}/api/user/update`,{
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({email, playername, password})
            })

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || "something went error")
            }
        } catch (error) {
            throw error;
        }
    },
    onSuccess : () => {
        toast.success("User updated successfully");

        // Check a authUser details again and navigate to the home page
        queryClient.invalidateQueries({
            queryKey : ["authUser"]
        })
        navigate('/');
    }
  })

  // Prevent a reloading and call a funtion
  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
  };

  // Check changes and apply them
  const handleInputChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };


  return (
    <div className='flex h-screen w-screen justify-center items-center bg-blue-400 flex-col'>
        
        <div  className='max-w-sm mx-auto p-4 m-4 bg-blue-200 rounded-lg shadow-lg flex flex-col'>
        <button onClick={(e)=>{
        e.preventDefault();}} className='flex justify-end font-bold font-serif text-lg md:text-2xl lg:text-4xl top-0 m-2'>
          <Link to="/">
            <RxCross2 />
          </Link>
        </button>
            <form onSubmit={handleSubmit} className='flex itmes-center flex-col'>
                <label className='input input-bordered input-accent rounded flex items-center gap-5 sm:text-base md:text-lg lg:text-xl'>
                    <input
                        type='email'
                        className='grow font-serif'
                        placeholder='Email'
                        name='email'
                        onChange={handleInputChange}
                        value={formData.email}
                    />
                </label>
                <label className='input input-bordered input-accent rounded flex items-center gap-5 sm:text-base md:text-lg lg:text-xl'>
                    <input
                        type= 'text'
                        className='grow font-serif'
                        placeholder='Username'
                        name='playername'
                        onChange={handleInputChange} 
                        value={formData.playername}
                    />
                </label>
                <label className='input input-bordered input-accent rounded flex items-center gap-5 sm:text-base md:text-lg lg:text-xl'>
                    <input
                        type= 'password'
                        className='grow font-serif'
                        placeholder='CurrentPassword'
                        name='currentPassword'
                        onChange={handleInputChange}
                        value={formData.currentPassword}
                    />
                </label>
                <label className='input input-bordered input-accent rounded flex items-center gap-5 sm:text-base md:text-lg lg:text-xl'>
                    <input
                        type= 'password'
                        className='grow font-serif'
                        placeholder='NewPassword'
                        name='newPassword'
                        onChange={handleInputChange}
                        value={formData.newPassword}
                    />
                </label>
                <button className='btn rounded-full bg-blue-500 text-white text-sm sm:text-sm md:text-base lg:text:lg font-serif shadow-md hover:bg-blue-600 active:bg-blue-700 border-0 mt-2'>
                    {isPending ? <LoadingSpinner /> : "Update"}
                </button>
                {isError && <p className='text-red-500 sm:text-sm md:text-base lg:text:lg font-serif'>{error.message}</p>}
            </form>
        </div>
    </div>
  )
}

export default EditProfileModal;