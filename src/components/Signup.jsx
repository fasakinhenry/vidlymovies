import React, { useState } from 'react';
import { register, getCurrentUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';

function Signup({ setUser }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Basic validation
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      console.log('Registering user with:', { name: name.trim(), email: email.trim(), password: '***' });
      
      const response = await register({ 
        name: name.trim(), 
        email: email.trim(), 
        password 
      });
      
      console.log('Full registration response:', response);
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      console.log('Response data:', response.data);
      
      const token = response.headers['x-auth-token'];
      console.log('Token from headers:', token);
      
      if (!token) {
        console.log('No token found in response headers');
        setError('Registration failed. No authentication token received.');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', token);
      console.log('Token saved to localStorage');

      try {
        console.log('Attempting to get current user...');
        const userResponse = await getCurrentUser();
        console.log('Current user response:', userResponse);
        
        setUser(userResponse.data);
        setSuccess('Signup successful! You are now logged in.');
        setTimeout(() => navigate('/movies'), 1000);
      } catch (userError) {
        console.log('Error getting current user:', userError);
        localStorage.removeItem('token');
        setError('Registration successful, but login failed. Please try logging in manually.');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      console.log('Registration error details:');
      console.log('Error object:', error);
      console.log('Error response:', error.response);
      console.log('Error status:', error.response?.status);
      console.log('Error data:', error.response?.data);
      console.log('Error message:', error.message);
      
      if (error.response?.status === 400) {
        const errorMessage = error.response.data || 'Registration failed. Please check your details.';
        
        // Check if user already exists
        if (errorMessage.includes('already registered')) {
          setError('An account with this email already exists. Please log in instead.');
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setError(errorMessage);
        }
      } else if (error.code === 'ERR_BAD_REQUEST' && !error.response) {
        // Network or CORS issue - user might have been created
        setError('Registration may have succeeded but verification failed. Please try logging in.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
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
            disabled={loading}
            required
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
            disabled={loading}
            required
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
            disabled={loading}
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-3 rounded-md text-sm font-medium transition ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-500'
          } text-white`}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}

export default Signup;
