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
    const token = response.data;
    console.log('Login token:', token);
    if (!token) throw new Error('No token received from login');
    localStorage.setItem('token', token);
    console.log('Token stored in localStorage:', localStorage.getItem('token'));
    const userResponse = await getCurrentUser();
    console.log('User response after login:', userResponse.data);
    setUser(userResponse.data);
    setError('');
    navigate('/movies');
    } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    setError(error.response?.data || 'Login failed. Please try again.');
    }
};

return (
    <div className="max-w-md mx-auto mt-16">
    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Login</h2>
    {error && <p className="text-red-500 mb-6 text-sm font-medium">{error}</p>}
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-sm card flex flex-col gap-4">
        <div>
        <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
        <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        </div>
        <div>
        <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
        <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        </div>
        <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-500 text-sm font-medium transition"
        >
        Login
        </button>
    </form>
    </div>
);
}

export default Login;
