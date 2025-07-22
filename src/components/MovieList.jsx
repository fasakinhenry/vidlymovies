import React, { useState, useEffect } from 'react';
import {
  getMovies,
  createMovie,
  updateMovie,
  deleteMovie,
  getGenres,
} from '../api/movies';

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesResponse, genresResponse] = await Promise.all([
          getMovies(),
          getGenres(),
        ]);
        console.log('getMovies response:', moviesResponse.data); // Debug
        console.log('getGenres response:', genresResponse.data); // Debug
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
        setError(
          error.response?.status === 401
            ? 'Unauthorized. Please log in.'
            : 'Failed to fetch data. Please try again.'
        );
        setMovies([]);
        setGenres([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const movieData = {
        title,
        genre: genreId, // Send genreId as a string (ObjectId)
        numberInStock: Number(numberInStock),
        dailyRentalRate: Number(dailyRentalRate),
      };
      console.log('Submitting movie:', movieData); // Debug
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
    setGenreId(movie.genre._id); // Use genre._id
    setNumberInStock(movie.numberInStock);
    setDailyRentalRate(movie.dailyRentalRate);
    setSelectedMovieId(movie._id);
  };

  return (
    <div className='mt-10'>
      <h2 className='text-2xl font-bold mb-4 text-blue-400'>Manage Movies</h2>
      {error && <p className='text-red-500 mb-4'>{error}</p>}
      {isLoading ? (
        <p className='text-gray-400'>Loading movies...</p>
      ) : movies.length === 0 ? (
        <p className='text-gray-400'>No movies found.</p>
      ) : (
        <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {movies.map((movie) => (
            <li
              key={movie._id}
              className='bg-gray-800 p-4 rounded-lg shadow-md'
            >
              <h3 className='text-lg font-semibold'>{movie.title}</h3>
              <p className='text-gray-400'>
                Genre: {movie.genre?.name || 'Unknown'}
              </p>
              <p className='text-gray-400'>Stock: {movie.numberInStock}</p>
              <p className='text-gray-400'>
                Daily Rental Rate: ${movie.dailyRentalRate}
              </p>
              <div className='mt-2 flex gap-2'>
                <button
                  onClick={() => handleEdit(movie)}
                  className='bg-yellow-600 px-3 py-1 rounded-md hover:bg-yellow-500'
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(movie._id)}
                  className='bg-red-600 px-3 py-1 rounded-md hover:bg-red-500'
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <form
        onSubmit={handleSubmit}
        className='mb-8 flex flex-col gap-4 max-w-md'
      >
        <input
          type='text'
          placeholder='Movie Title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-400'
        />
        <select
          value={genreId}
          onChange={(e) => setGenreId(e.target.value)}
          className='p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-400'
        >
          <option value=''>Select Genre</option>
          {genres.map((genre) => (
            <option key={genre._id} value={genre._id}>
              {genre.name}
            </option>
          ))}
        </select>
        <input
          type='number'
          placeholder='Number in Stock'
          value={numberInStock}
          onChange={(e) => setNumberInStock(e.target.value)}
          min='0'
          max='255'
          className='p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-400'
        />
        <input
          type='number'
          placeholder='Daily Rental Rate'
          value={dailyRentalRate}
          onChange={(e) => setDailyRentalRate(e.target.value)}
          min='0'
          max='255'
          className='p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-400'
        />
        <button
          type='submit'
          className='bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-500'
        >
          {selectedMovieId ? 'Update Movie' : 'Add Movie'}
        </button>
      </form>
    </div>
  );
}

export default MovieList;
