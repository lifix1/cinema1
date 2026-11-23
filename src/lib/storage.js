import { INITIAL_MOVIES, INITIAL_HALLS, INITIAL_REVIEWS, generateDefaultSessions } from '../initialData.js';

export const getStoredMovies = () => {
  const data = localStorage.getItem('lumiere_movies');
  if (!data) {
    localStorage.setItem('lumiere_movies', JSON.stringify(INITIAL_MOVIES));
    return INITIAL_MOVIES;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_MOVIES;
  }
};

export const saveStoredMovies = (movies) => {
  localStorage.setItem('lumiere_movies', JSON.stringify(movies));
};

export const getStoredSessions = () => {
  const today = new Date().toISOString().split('T')[0];
  const data = localStorage.getItem('lumiere_sessions');
  if (data) {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const currentSessions = parsed.filter(s => s.date >= today);
        if (currentSessions.length !== parsed.length) {
          localStorage.setItem('lumiere_sessions', JSON.stringify(currentSessions));
        }
        return currentSessions;
      }
    } catch (e) {
      console.error("Error reading sessions from storage:", e);
    }
  }

  const defaultSessions = generateDefaultSessions(getStoredMovies());
  const currentDefaultSessions = defaultSessions.filter(s => s.date >= today);
  localStorage.setItem('lumiere_sessions', JSON.stringify(currentDefaultSessions));
  return currentDefaultSessions;
};

export const saveStoredSessions = (sessions) => {
  const today = new Date().toISOString().split('T')[0];
  const currentSessions = sessions.filter(s => s.date >= today);
  localStorage.setItem('lumiere_sessions', JSON.stringify(currentSessions));
};

export const getStoredBookings = () => {
  const data = localStorage.getItem('lumiere_bookings');
  return data ? JSON.parse(data) : [];
};

export const saveStoredBookings = (bookings) => {
  localStorage.setItem('lumiere_bookings', JSON.stringify(bookings));
};

export const getStoredReviews = () => {
  const data = localStorage.getItem('lumiere_reviews');
  if (!data) {
    localStorage.setItem('lumiere_reviews', JSON.stringify(INITIAL_REVIEWS));
    return INITIAL_REVIEWS;
  }
  return JSON.parse(data);
};

export const saveStoredReviews = (reviews) => {
  localStorage.setItem('lumiere_reviews', JSON.stringify(reviews));
};

export const getStoredHalls = () => {
  const data = localStorage.getItem('lumiere_halls');
  if (!data) {
    localStorage.setItem('lumiere_halls', JSON.stringify(INITIAL_HALLS));
    return INITIAL_HALLS;
  }
  return JSON.parse(data);
};

export const saveStoredHalls = (halls) => {
  localStorage.setItem('lumiere_halls', JSON.stringify(halls));
};
