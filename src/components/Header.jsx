import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../api/auth';

function Header({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className='bg-gray-800 p-4 shadow-md'>
      <div className='container mx-auto flex justify-between items-center'>
        <h1 className='text-2xl font-bold text-blue-400'>Vidly</h1>
        <nav>
          {user ? (
            <div className='flex items-center gap-4'>
              <span className='text-gray-300'>Welcome, {user.email}</span>
              <Link to='/movies' className='text-blue-400 hover:text-blue-300'>
                Movies
              </Link>
              <button
                onClick={handleLogout}
                className='bg-red-600 px-4 py-2 rounded-md hover:bg-red-500'
              >
                Logout
              </button>
            </div>
          ) : (
            <div className='flex gap-4'>
              <Link to='/login' className='text-blue-400 hover:text-blue-300'>
                Login
              </Link>
              <Link to='/signup' className='text-blue-400 hover:text-blue-300'>
                Signup
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
