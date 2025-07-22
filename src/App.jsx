import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import Signup from './components/Signup';
import MovieList from './components/MovieList';
import { getCurrentUser } from './api/auth';
import './App.css';
import './index.css'

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        console.log('getCurrentUser response:', response.data); // Debug
        if (response.data && response.data.email) {
          setUser(response.data);
        } else {
          setUser(null);
          setError('No user data returned. Please log in.');
        }
      } catch (error) {
        console.error('Error fetching user:', error.response?.data || error.message);
        setError(error.response?.status === 401 ? 'Unauthorized. Please log in.' : 'Failed to verify user. Please log in.');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (isLoading) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Header user={user} setUser={setUser} />
        <main className="container mx-auto p-4">
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/movies" /> : <Login setUser={setUser} />} />
            <Route path="/signup" element={user ? <Navigate to="/movies" /> : <Signup setUser={setUser} />} />
            <Route path="/movies" element={user ? <MovieList /> : <Navigate to="/login" />} />
            <Route path="/" element={<Navigate to={user ? "/movies" : "/login"} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
