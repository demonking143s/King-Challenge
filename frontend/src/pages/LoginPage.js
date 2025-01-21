import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from 'react-hot-toast';

import { baseUrl } from "../utils/url.js";
import LoadingSpinner from "../components/common/LoadingSpinner.js";

const LoginPage = () => {
    // Get login details from user
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    const queryClient = useQueryClient();

    // Send a given details to backend
    const {mutate: login, isPending, isError, error} = useMutation({
        mutationFn: async ({email, password}) => {
            try {
                const res = await fetch(`${baseUrl}/api/auth/login`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({email, password})
                })

                const data = await res.json();

                console.log(data);

                if(!res.ok){
                    throw new error(data.error || "something went wrong");
                }
            } catch (error) {
                throw error;
            }
        },
        onSuccess: () => {
            toast.success("User logged in successfully");
            
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
        login(formData)
    };

    // Check changes and apply them
    const handleInputChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

  return (
    <div className='flex justify-center items-center h-screen w-screen bg-blue-400'>
        <div className='max-w-sm mx-auto p-4 m-4 bg-blue-200 rounded-lg shadow-lg flex flex-col items-center'>
            <h1 className='text-lg md:text-2xl lg:text-4xl font-serif text-black'>
                Log in
            </h1>
            <form onSubmit={handleSubmit}>
                <label className=' text-black bg-white input input-bordered input-accent rounded flex items-center gap-5 sm:text-base md:text-lg lg:text-xl'>
                    <input
                        type='email'
                        className='grow font-serif'
                        placeholder='Email'
                        name='email'
                        onChange={handleInputChange}
                        value={formData.email}
                    />
                </label>
                <label className=' text-black bg-white input input-bordered input-accent rounded flex items-center gap-5 sm:text-base md:text-lg lg:text-xl'>
                    <input
                        type= 'password'
                        className='grow font-serif'
                        placeholder='Password'
                        name='password'
                        onChange={handleInputChange}
                        value={formData.password}
                    />
                </label>
                <button className='btn rounded-full bg-blue-500 text-white text-sm sm:text-sm md:text-base lg:text:lg font-serif shadow-md hover:bg-blue-600 active:bg-blue-700 border-0'>
                    {isPending ? <LoadingSpinner /> : "Login"}
                </button>
                {isError && <p className='text-red-500 sm:text-sm md:text-base lg:text:lg font-serif'>{error.message}</p>}
            </form>
            <p className='sm:text-sm md:text-base lg:text:lg font-serif text-black'>Don't have any account</p>
            <button className='btn btn-xs font-serif text-black bg-green-500 hover:bg-green-600 active:bg-green-700 md:text-xs lg:text-sm'>
            <Link to='/signup'>Sign up</Link>
            </button>
        </div>
    </div>
  )
}
export default LoginPage;