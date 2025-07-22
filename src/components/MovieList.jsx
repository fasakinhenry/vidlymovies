import React, { useState, useEffect } from 'react';
import {
  getMovies,
  createMovie,
  updateMovie,
  deleteMovie,
  getGenres,
} from '../api/movies';
import { useNavigate } from 'react-router-dom';

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [title, setTitle] = useState('');
  const [genreId, setGenreId] = useState('');
  const [numberInStock, setNumberInStock] = useState('');
  const [dailyRentalRate, setDailyRentalRate] = useState('');
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesResponse, genresResponse] = await Promise.all([
          getMovies(),
          getGenres(),
        ]);
        console.log('getMovies response:', moviesResponse.data);
        console.log('getGenres response:', genresResponse.data);
        setMovies(
          Array.isArray(moviesResponse.data) ? moviesResponse.data : []
        );
        setGenres(
          Array.isArray(genresResponse.data) ? genresResponse.data : []
        );
      } catch (error) {
        console.error(
          'Error fetching data:',
          error.response?.data || error.message
        );
        if (error.response?.status === 401) {
          setError('Unauthorized. Please log in.');
          navigate('/login');
        } else {
          setError('Failed to fetch data. Please try again.');
        }
        setMovies([]);
        setGenres([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const movieData = {
        title,
        genre: genreId,
        numberInStock: Number(numberInStock),
        dailyRentalRate: Number(dailyRentalRate),
      };
      console.log('Submitting movie:', movieData);
      if (selectedMovieId) {
        const response = await updateMovie(selectedMovieId, movieData);
        setMovies(
          movies.map((movie) =>
            movie._id === selectedMovieId ? response.data : movie
          )
        );
      } else {
        const response = await createMovie(movieData);
        setMovies([...movies, response.data]);
      }
      setTitle('');
      setGenreId('');
      setNumberInStock('');
      setDailyRentalRate('');
      setSelectedMovieId(null);
      setError('');
    } catch (error) {
      console.error(
        'Error saving movie:',
        error.response?.data || error.message
      );
      setError(error.response?.data?.message || 'Failed to save movie');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMovie(id);
      setMovies(movies.filter((movie) => movie._id !== id));
      setError('');
    } catch (error) {
      console.error(
        'Error deleting movie:',
        error.response?.data || error.message
      );
      setError(error.response?.data?.message || 'Failed to delete movie');
    }
  };

  const handleEdit = (movie) => {
    setTitle(movie.title);
    setGenreId(movie.genre._id);
    setNumberInStock(movie.numberInStock);
    setDailyRentalRate(movie.dailyRentalRate);
    setSelectedMovieId(movie._id);
  };

  return (
    <div className='py-8'>
      <h2 className='text-2xl font-semibold text-gray-900 mb-6 text-center'>
        Manage Movies
      </h2>
      {error && (
        <p className='text-red-500 mb-6 text-sm font-medium'>{error}</p>
      )}
      <form
        onSubmit={handleSubmit}
        className='mb-8 max-w-md mx-auto bg-white p-6 rounded-md shadow-sm card'
      >
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-medium mb-1'>
            Movie Title
          </label>
          <input
            type='text'
            placeholder='Enter movie title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='w-full p-3 border border-gray-200 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-medium mb-1'>
            Genre
          </label>
          <select
            value={genreId}
            onChange={(e) => setGenreId(e.target.value)}
            className='w-full p-3 border border-gray-200 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          >
            <option value=''>Select Genre</option>
            {genres.map((genre) => (
              <option key={genre._id} value={genre._id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-medium mb-1'>
            Number in Stock
          </label>
          <input
            type='number'
            placeholder='Enter stock'
            value={numberInStock}
            onChange={(e) => setNumberInStock(e.target.value)}
            min='0'
            max='255'
            className='w-full p-3 border border-gray-200 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-medium mb-1'>
            Daily Rental Rate
          </label>
          <input
            type='number'
            placeholder='Enter rental rate'
            value={dailyRentalRate}
            onChange={(e) => setDailyRentalRate(e.target.value)}
            min='0'
            max='255'
            className='w-full p-3 border border-gray-200 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          />
        </div>
        <button
          type='submit'
          className='w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-500 text-sm font-medium transition'
        >
          {selectedMovieId ? 'Update Movie' : 'Add Movie'}
        </button>
      </form>
      <h3 className='text-xl font-semibold text-gray-900 mb-4 text-center'>
        Movie List
      </h3>
      {isLoading ? (
        <p className='text-gray-500 text-sm font-medium'>Loading movies...</p>
      ) : movies.length === 0 ? (
        <p className='text-gray-500 text-sm font-medium'>
          No movies found. Add a movie above.
        </p>
      ) : (
        <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {movies.map((movie) => (
            <li
              key={movie._id}
              className='bg-white p-6 rounded-md border border-gray-200 hover:shadow-md transition-shadow'
            >
              <h3 className='text-lg font-semibold text-gray-900'>
                {movie.title}
              </h3>
              <p className='text-gray-500 text-sm'>
                Genre: {movie.genre?.name || 'Unknown'}
              </p>
              <p className='text-gray-500 text-sm'>
                Stock: {movie.numberInStock}
              </p>
              <p className='text-gray-500 text-sm'>
                Daily Rental Rate: ${movie.dailyRentalRate}
              </p>
              <div className='mt-4 flex gap-3 w-full'>
                <button
                  onClick={() => handleEdit(movie)}
                  className='cursor-pointer bg-gray-200 text-gray-900 px-4 py-2 rounded-md hover:bg-black hover:text-white text-sm font-medium transition flex-3'
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(movie._id)}
                  className='cursor-pointer bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500 text-sm font-medium transition flex-1'
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MovieList;
