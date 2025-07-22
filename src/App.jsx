import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import Signup from './components/Signup';
import MovieList from './components/MovieList';
import { getCurrentUser } from './api/auth';
import './App.css';
import './index.css'; // Ensure you have Tailwind CSS imported

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  // Check if user is logged in on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        if (response.data && response.data.email) {
          setUser(response.data); // Only set user if valid data is returned
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null); // Ensure user is null on error
      } finally {
        setIsLoading(false); // Set loading to false after fetch
      }
    };
    fetchUser();
  }, []);

  // Show loading state while fetching user
  if (isLoading) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Header user={user} setUser={setUser} />
        <main className="container mx-auto p-4">
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
