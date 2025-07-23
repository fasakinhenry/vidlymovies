import React, { useState } from 'react';
import { register, getCurrentUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';

function Signup({ setUser }) {
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');
const [success, setSuccess] = useState('');
const navigate = useNavigate();

const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
    const response = await register({ name, email, password });
    const token = response.headers['x-auth-token'];
    if (!token) {
        setError('Signup failed: No token received from server.');
        return;
    }
    localStorage.setItem('token', token);
    try {
        const userResponse = await getCurrentUser();
        setUser(userResponse.data);
        setSuccess('Signup successful! You are now logged in.');
        setTimeout(() => navigate('/movies'), 1000);
    } catch (userError) {
        localStorage.removeItem('token');
        setError('Signup successful, but failed to log in: ' + (userError.response?.data || 'Server error. Please log in manually.'));
        setTimeout(() => navigate('/login'), 2000);
    }
    } catch (error) {
    setError(error.response?.data || 'Signup failed: Please check your details and try again.');
    }
};

return (
    <div className="max-w-md mx-auto mt-16">
    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Sign Up</h2>
    {error && <p className="text-red-500 mb-6 text-sm font-medium">{error}</p>}
    {success && <p className="text-green-500 mb-6 text-sm font-medium">{success}</p>}
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-sm card flex flex-col gap-4">
        <div>
        <label className="block text-gray-700 text-sm font-medium mb-1">Name</label>
        <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        </div>
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
        Sign Up
        </button>
    </form>
    </div>
);
}

export default Signup;
