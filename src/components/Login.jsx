import React, { useState } from 'react';
import { login, getCurrentUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ email, password });
      const token = response.data; // Token in response body for /api/auth/
      console.log('Login token:', token); // Debug: Check token
      if (!token) throw new Error('No token received from login');
      localStorage.setItem('token', token); // Save token
      console.log(
        'Token stored in localStorage:',
        localStorage.getItem('token')
      ); // Debug
      const userResponse = await getCurrentUser();
      console.log('User response after login:', userResponse.data); // Debug
      setUser(userResponse.data);
      setError('');
      navigate('/movies'); // Redirect to movies
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      setError(error.response?.data || 'Login failed. Please try again.');
    }
  };

  return (
    <div className='max-w-md mx-auto mt-10'>
      <h2 className='text-2xl font-bold mb-4 text-blue-400'>Login</h2>
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
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
