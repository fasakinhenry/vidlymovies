import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import Signup from './components/Signup';
import MovieList from './components/MovieList';
import { getCurrentUser } from './api/auth';
import './App.css';
import './index.css';

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
        console.error(
          'Error fetching user:',
          error.response?.data || error.message
        );
        setError(
          error.response?.status === 401
            ? 'Unauthorized. Please log in.'
            : 'Failed to verify user. Please log in.'
        );
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <div className='min-h-screen bg-white flex items-center justify-center'>
        <p className='text-gray-500 text-lg font-medium'>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className='min-h-screen bg-white text-gray-900'>
        <Header user={user} setUser={setUser} />
        <main className='container mx-auto px-4 py-8 max-w-7xl'>
          {error && (
            <p className='text-red-500 text-center mb-6 text-sm font-medium'>
              {error}
            </p>
          )}
          <Routes>
            <Route
              path='/login'
              element={
                user ? <Navigate to='/movies' /> : <Login setUser={setUser} />
              }
            />
            <Route
              path='/signup'
              element={
                user ? <Navigate to='/movies' /> : <Signup setUser={setUser} />
              }
            />
            <Route
              path='/movies'
              element={user ? <MovieList /> : <Navigate to='/login' />}
            />
            <Route
              path='/'
              element={<Navigate to={user ? '/movies' : '/login'} />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
