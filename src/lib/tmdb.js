const TMDB_READ_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ODEyZmM0YzMzMmM5ZTMwMTc5YzY2NjU2OTNiOTQyZCIsIm5iZiI6MTc3OTU2ODc2NS4yNDcsInN1YiI6IjZhMTIxMDdkODNjNGI4MTVjM2UzNzJjNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.oQCdaWYAWfti2c6Rr6eSA6uWFNcYvc2g6ohcgcmusiI';

const getHeaders = () => {
  return {
    'accept': 'application/json',
    'Authorization': `Bearer ${TMDB_READ_TOKEN}`
  };
};

const buildUrl = (path, params = {}) => {
  const queryParams = new URLSearchParams({
    language: 'ru-RU',
    ...params
  });
  return `https://api.themoviedb.org/3${path}?${queryParams.toString()}`;
};

const formatRuntime = (minutes) => {
  if (!minutes) return '2 ч 00 мин';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs > 0) {
    return `${hrs} ч ${mins > 0 ? mins + ' мин' : ''}`.trim();
  }
  return `${mins} мин`;
};

export async function getTrendingMovies() {
  try {
    const url = buildUrl('/trending/movie/day');
    const response = await fetch(url, { headers: getHeaders() });
    if (!response.ok) throw new Error('Ошибка при обращении к TMDB REST API');
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('TMDB Error in getTrendingMovies:', error);
    return [];
  }
}

export async function searchMovies(query) {
  if (!query || !query.trim()) return [];
  try {
    const url = buildUrl('/search/movie', { query: query.trim() });
    const response = await fetch(url, { headers: getHeaders() });
    if (!response.ok) throw new Error('Ошибка поиска в TMDB');
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('TMDB Error in searchMovies:', error);
    return [];
  }
}

export async function getMovieDetails(tmdbId) {
  try {
    const url = buildUrl(`/movie/${tmdbId}`);
    const response = await fetch(url, { headers: getHeaders() });
    if (!response.ok) throw new Error('Ошибка получения деталей фильма из TMDB');
    const movie = await response.json();

    const movieYear = movie.release_date ? parseInt(movie.release_date.split('-')[0]) : new Date().getFullYear();
    const movieRating = movie.vote_average ? Math.round((movie.vote_average / 2) * 10) / 10 : 4.5;
    const matchRating = movie.popularity ? Math.min(99, Math.max(75, Math.round(movie.popularity % 25) + 75)) : 90;
    
    const genreTags = movie.genres ? movie.genres.slice(0, 3).map(g => g.name) : ['Кино'];

    return {
      id: `tmdb-${movie.id}`,
      title: movie.title || movie.original_title,
      originalTitle: movie.original_title || '',
      year: movieYear,
      match: matchRating,
      tags: genreTags,
      duration: formatRuntime(movie.runtime),
      description: movie.overview || 'Сюжет фильма временно отсутствует.',
      posterUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=600&auto=format&fit=crop&q=80',
      backdropUrl: movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600&auto=format&fit=crop&q=80',
      rating: movieRating > 0 ? movieRating : 4.5
    };
  } catch (error) {
    console.error('TMDB Error in getMovieDetails:', error);
    return null;
  }
}
