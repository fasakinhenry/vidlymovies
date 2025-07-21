import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/auth';

function Signup({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await register({ email, password });
      setUser(response.data.user);
      localStorage.setItem('token', response.data.token);
      navigate('/movies');
    } catch (error) {
      setError(error.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className='max-w-md mx-auto mt-10 bg-gray-800 p-6 rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold mb-4 text-blue-400'>Signup</h2>
      {error && <p className='text-red-500 mb-4'>{error}</p>}
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-400'
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-400'
        />
        <button
          type='submit'
          className='bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-500'
        >
          Signup
        </button>
      </form>
    </div>
  );
}

export default Signup;
