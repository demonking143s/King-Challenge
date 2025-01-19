import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import LoadingSpinner from '../components/common/LoadingSpinner.js';
import { baseUrl } from '../utils/url.js';

const SignUpPage = () => {
    // Get a details from user
    const [formData, setFormData] = useState({
        email: "",
        playername: "",
        password: "",
    });

    const navigate = useNavigate();

    const queryClient = useQueryClient();

    // Send a given details to backend
    const {mutate : signup, isPending, isError , error} = useMutation({
        mutationFn: async ({email, playername, password}) => {
            try {
                const res = await fetch(`${baseUrl}/api/auth/signup`,{
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({email, playername, password})
                })

                const data = await res.json();

                console.log(data)

                if(!res.ok){
                    throw new Error(data.error || "something went error")
                }
            } catch (error) {
                throw error;
            }
        },
        onSuccess : () => {
            toast.success("User created successfully"); // success alert

            // Check a authUser details again and navigate to the home page
            queryClient.invalidateQueries({
                queryKey : ["authUser"]
            })
            navigate('/');
        }
    })

    // Prevent a reloading and call a fuction
    const handleSubmit = (e) => {
        e.preventDefault();
        signup(formData);
    };

    // Check changes and apply them
    const handleInputChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

  return (
    <div className='flex justify-center items-center h-screen w-screen bg-blue-400'>
        <div className='max-w-sm mx-auto p-4 m-4 bg-blue-200 rounded-xl shadow-lg flex flex-col items-center'>
            <h1 className='text-lg md:text-2xl lg:text-4xl font-serif'>
                Sign Up
            </h1>
            <form onSubmit={handleSubmit}>
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
                        placeholder='Password'
                        name='password'
                        onChange={handleInputChange}
                        value={formData.password}
                    />
                </label>
                <button className='btn rounded-full bg-blue-500 text-white text-sm sm:text-sm md:text-base lg:text:lg font-serif shadow-md hover:bg-blue-600 active:bg-blue-700'>
                    {isPending ? <LoadingSpinner /> : "Sign Up"}
                </button>
                {isError && <p className='text-red-500 sm:text-sm md:text-base lg:text:lg font-serif'>{error.message}</p>}
            </form>
            <p className='sm:text-sm md:text-base lg:text:lg font-serif'>Already have a account</p>
            <button className='btn btn-xs font-serif bg-green-500 hover:bg-green-600 active:bg-green-700 md:text-xs lg:text-sm'>
            <Link to='/login'>Log in</Link>
            </button>
        </div>
    </div>
  )
}
export default SignUpPage;