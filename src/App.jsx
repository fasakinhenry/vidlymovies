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
      const token = localStorage.getItem('token');
      
      // If no token exists, don't try to fetch user
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const response = await getCurrentUser();
        console.log('getCurrentUser response:', response.data);
        
        if (response.data && response.data.email) {
          setUser(response.data);
        } else {
          setUser(null);
          localStorage.removeItem('token'); // Remove invalid token
        }
      } catch (error) {
        console.error('Error fetching user:', error.response?.data || error.message);
        
        // If unauthorized, remove the invalid token
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
        }
        
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
