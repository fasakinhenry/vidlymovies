import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Header({ user, setUser }) {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogout = () => {
    try {
      console.log('Logging out client-side...'); // Debug
      setUser(null);
      localStorage.removeItem('token');
      navigate('/login');
      console.log('Logout successful, token removed'); // Debug
    } catch (error) {
      console.error('Error during client-side logout:', error.message);
      setError('Failed to log out. Please try again.');
    }
  };

  return (
    <header className='bg-white p-4 shadow-sm sticky top-0 z-10'>
      <div className='container mx-auto flex justify-between items-center'>
        <h1 className='text-2xl font-semibold text-gray-900'>Vidly</h1>
        <nav>
          {user ? (
            <div className='flex items-center gap-4'>
              <span className='text-gray-600 text-sm font-medium'>
                Welcome, {user.email}
              </span>
              <Link
                to='/movies'
                className='text-blue-600 hover:text-blue-500 text-sm font-medium transition'
              >
                Movies
              </Link>
              <button
                onClick={handleLogout}
                className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 text-sm font-medium transition'
              >
                Logout
              </button>
            </div>
          ) : (
            <div className='flex gap-4'>
              <Link
                to='/login'
                className='text-blue-600 hover:text-blue-500 text-sm font-medium transition'
              >
                Login
              </Link>
              <Link
                to='/signup'
                className='text-blue-600 hover:text-blue-500 text-sm font-medium transition'
              >
                Signup
              </Link>
            </div>
          )}
        </nav>
      </div>
      {error && (
        <p className='text-red-500 text-center mt-2 text-sm font-medium'>
          {error}
        </p>
      )}
    </header>
  );
}

export default Header;
