import React, { useState, useEffect } from 'react';
import { getMovies, createMovie, updateMovie, deleteMovie } from '../api/movies';

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [error, setError] = useState('');

  // Fetch movies on mount
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await getMovies();
        setMovies(response.data);
      } catch (error) {
        setError('Failed to fetch movies');
      }
    };
    fetchMovies();
  }, []);

  // Add or update movie
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedMovieId) {
        const response = await updateMovie(selectedMovieId, { title, genre });
        setMovies(movies.map((movie) => (movie._id === selectedMovieId ? response.data : movie)));
      } else {
        const response = await createMovie({ title, genre });
        setMovies([...movies, response.data]);
      }
      setTitle('');
      setGenre('');
      setSelectedMovieId(null);
      setError('');
    } catch (error) {
      setError('Failed to save movie');
    }
  };

  // Delete movie
  const handleDelete = async (id) => {
    try {
      await deleteMovie(id);
      setMovies(movies.filter((movie) => movie._id !== id));
    } catch (error) {
      setError('Failed to delete movie');
    }
  };

  // Select movie for editing
  const handleEdit = (movie) => {
    setTitle(movie.title);
    setGenre(movie.genre);
    setSelectedMovieId(movie._id);
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4 text-blue-400">Manage Movies</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="mb-8 flex flex-col gap-4 max-w-md">
        <input
          type="text"
          placeholder="Movie Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-400"
        />
        <input
          type="text"
          placeholder="Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-500"
        >
          {selectedMovieId ? 'Update Movie' : 'Add Movie'}
        </button>
      </form>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {movies.map((movie) => (
          <li key={movie._id} className="bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">{movie.title}</h3>
            <p className="text-gray-400">{movie.genre}</p>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => handleEdit(movie)}
                className="bg-yellow-600 px-3 py-1 rounded-md hover:bg-yellow-500"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(movie._id)}
                className="bg-red-600 px-3 py-1 rounded-md hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MovieList;
