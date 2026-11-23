import { useState, useEffect } from 'react';
import {
  getStoredMovies,
  saveStoredMovies,
  getStoredSessions,
  saveStoredSessions,
  getStoredBookings,
  saveStoredBookings,
  getStoredReviews,
  saveStoredReviews,
  getStoredHalls,
} from './lib/storage.js';
import { getTrendingMovies, getMovieDetails } from './lib/tmdb.js';
import { generateDefaultSessions } from './initialData.js';
import UserCabinet from './components/UserCabinet.jsx';
import BookingModal from './components/BookingModal.jsx';
import MovieDetailModal from './components/MovieDetailModal.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import AuthModal from './components/AuthModal.jsx';
import CustomDropdown from './components/CustomDropdown.jsx';
import HeroCarousel from './components/HeroCarousel.jsx';

import {
  Film,
  Search,
  User,
  Sliders,
  Play,
  Star,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [movies, setMovies] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [halls, setHalls] = useState([]);
  const [moviesLoading, setMoviesLoading] = useState(false);

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('lumiere_users');
    if (saved) return JSON.parse(saved);
    const initial = [
      {
        email: 'ssp22112@gmail.com',
        password: 'password',
        name: 'Константин',
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
      },
      {
        email: 'admin@lumiere.ru',
        password: 'admin',
        name: 'Александр',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
      }
    ];
    localStorage.setItem('lumiere_users', JSON.stringify(initial));
    return initial;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('lumiere_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [currentRole, setCurrentRole] = useState(() => {
    const saved = localStorage.getItem('lumiere_current_user');
    return saved ? JSON.parse(saved).role : 'user';
  });
  const [activeSection, setActiveSection] = useState('home');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [bookingSession, setBookingSession] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [userName, setUserName] = useState(() => {
    const saved = localStorage.getItem('lumiere_current_user');
    return saved ? JSON.parse(saved).name : 'Гость';
  });

  const getDynamicSlides = () => {
    if (!movies || movies.length === 0) return [];
    
    const promoContexts = [
      { tagline: 'ЛИДЕР ПРОКАТА / СЕНСАЦИЯ СЕЗОНА', badge: 'Топ продаж', badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' },
      { tagline: 'РЕКОМЕНДУЕМ К ПРОСМОТРУ / НОВИНКА ДНЯ', badge: 'Выбор критиков', badgeColor: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' },
      { tagline: 'ПОТРЯСАЮЩИЕ ВИЗУАЛЬНЫЕ ЭФФЕКТЫ / КИНОТЕАТР', badge: 'IMAX Laser', badgeColor: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' },
      { tagline: 'ВЕЛИКОЛЕПНЫЙ ЗВУК И АТМОСФЕРА', badge: 'Dolby Atmos', badgeColor: 'bg-pink-500/20 text-pink-400 border border-pink-500/30' },
      { tagline: 'ЭКСКЛЮЗИВНЫЕ СЕАНСЫ В VIP ЛОУНДЖЕ', badge: 'Винтажный VIP-зал', badgeColor: 'bg-red-500/20 text-red-400 border border-red-500/30' }
    ];

    return movies.slice(0, 5).map((movie, idx) => {
      const promo = promoContexts[idx % promoContexts.length];
      return {
        id: movie.id,
        title: movie.title,
        tagline: promo.tagline,
        badge: promo.badge,
        badgeColor: promo.badgeColor,
        description: movie.description || 'Спешите забронировать лучшие места на утренние и вечерние сеансы!',
        backdropUrl: movie.backdropUrl || movie.posterUrl
      };
    });
  };

  const carouselSlides = getDynamicSlides();
  const activeSlide = carouselSlides[currentSlide] || carouselSlides[0];

  useEffect(() => {
    if (activeSection !== 'home' || activeFilter !== 'all' || carouselSlides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [activeSection, activeFilter, carouselSlides.length]);

  const [userEmail, setUserEmail] = useState(() => {
    const saved = localStorage.getItem('lumiere_current_user');
    return saved ? JSON.parse(saved).email : '';
  });
  const [selectedDateFilter, setSelectedDateFilter] = useState('all');

  const getNextSevenDays = () => {
    const days = [];
    const weekdays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      
      let label = '';
      if (i === 0) label = 'Сегодня';
      else if (i === 1) label = 'Завтра';
      else {
        label = `${d.getDate()} ${months[d.getMonth()]}`;
      }
      days.push({ dateStr, label, weekday: weekdays[d.getDay()] });
    }
    return days;
  };

  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const autoCheckAndFillSessions = (moviesList, sessionsList) => {
      const today = new Date().toISOString().split('T')[0];
      const days = getNextSevenDays();
      const halls = ['hall-imax', 'hall-dolby', 'hall-vip'];
      const times = ['12:15', '15:30', '19:00', '21:45'];

      const getPrice = (time, hallId) => {
        const hour = parseInt(time.split(':')[0], 10);
        let base = hour < 14 ? 300 : hour < 19 ? 420 : 500;
        if (hallId === 'hall-imax') base += 120;
        if (hallId === 'hall-vip') base += 350;
        return base;
      };

      let updated = [...sessionsList].filter(s => s.date >= today);
      let hasChanges = false;

      moviesList.forEach((movie) => {
        days.forEach((day, dayIdx) => {
          const hasSessionOnDay = updated.some(s => s.movieId === movie.id && s.date === day.dateStr);
          if (!hasSessionOnDay) {
            const t1 = times[dayIdx % times.length];
            const t2 = times[(dayIdx + 2) % times.length];
            const h1 = halls[dayIdx % halls.length];
            const h2 = halls[(dayIdx + 1) % halls.length];

            updated.push({
              id: `sess-auto-${movie.id}-${day.dateStr}-1`,
              movieId: movie.id,
              hallId: h1,
              date: day.dateStr,
              time: t1,
              price: getPrice(t1, h1)
            });

            updated.push({
              id: `sess-auto-${movie.id}-${day.dateStr}-2`,
              movieId: movie.id,
              hallId: h2,
              date: day.dateStr,
              time: t2,
              price: getPrice(t2, h2)
            });
            hasChanges = true;
          }
        });
      });

      if (hasChanges) {
        saveStoredSessions(updated);
      }
      return updated;
    };

    const initApp = async () => {
      let loadedMovies = getStoredMovies();
      let loadedSessions = getStoredSessions();

      const hasTmdbMovies = localStorage.getItem('lumiere_has_tmdb_movies') === 'true';
      const isDefaultMock = loadedMovies.some(m => ['raya', 'john-wick', 'baby-driver', 'blade-runner'].includes(m.id));

      if (!hasTmdbMovies || isDefaultMock) {
        setMoviesLoading(true);
        try {
          const trends = await getTrendingMovies();
          if (trends && trends.length > 0) {
            const topTrends = trends.slice(0, 10);
            const detailedMovies = [];
            
            for (const trend of topTrends) {
              try {
                const details = await getMovieDetails(trend.id);
                if (details) detailedMovies.push(details);
              } catch (e) {
                console.error(`Failed to load details for tmdb-${trend.id}`, e);
              }
            }

            if (detailedMovies.length > 0) {
              saveStoredMovies(detailedMovies);
              setMovies(detailedMovies);
              
              const newSessions = generateDefaultSessions(detailedMovies);
              saveStoredSessions(newSessions);
              setSessions(newSessions);
              
              localStorage.setItem('lumiere_has_tmdb_movies', 'true');
              showToast('Каталог кинотеатра успешно обновлен живыми данными из TMDB API!');
            } else {
              setMovies(loadedMovies);
              setSessions(loadedSessions);
            }
          } else {
            setMovies(loadedMovies);
            setSessions(loadedSessions);
          }
        } catch (error) {
          console.error("TMDB Startup import error:", error);
          setMovies(loadedMovies);
          setSessions(loadedSessions);
        } finally {
          setMoviesLoading(false);
        }
      } else {
        setMovies(loadedMovies);
        setSessions(loadedSessions);
      }

      const finalMovies = getStoredMovies();
      const finalSessions = getStoredSessions();
      const synchronizedSessions = autoCheckAndFillSessions(finalMovies, finalSessions);
      setSessions(synchronizedSessions);

      setBookings(getStoredBookings());
      setReviews(getStoredReviews());
      setHalls(getStoredHalls());
    };

    initApp();
  }, []);

  const handleAddMovie = (newMovie) => {
    const updated = [newMovie, ...movies];
    setMovies(updated);
    saveStoredMovies(updated);

    const today = new Date().toISOString().split('T')[0];
    const days = getNextSevenDays();
    const halls = ['hall-imax', 'hall-dolby', 'hall-vip'];
    const times = ['12:15', '15:30', '19:00', '21:45'];

    const newMovieSessions = [];
    days.forEach((day, dayIdx) => {
      const t1 = times[dayIdx % times.length];
      const t2 = times[(dayIdx + 2) % times.length];

      const h1 = halls[dayIdx % halls.length];
      const h2 = halls[(dayIdx + 1) % halls.length];

      const getPrice = (time, hallId) => {
        const hour = parseInt(time.split(':')[0], 10);
        let base = hour < 14 ? 300 : hour < 19 ? 420 : 500;
        if (hallId === 'hall-imax') base += 120;
        if (hallId === 'hall-vip') base += 350;
        return base;
      };

      newMovieSessions.push({
        id: `sess-auto-${newMovie.id}-${dayIdx}-1`,
        movieId: newMovie.id,
        hallId: h1,
        date: day.dateStr,
        time: t1,
        price: getPrice(t1, h1)
      });

      newMovieSessions.push({
        id: `sess-auto-${newMovie.id}-${dayIdx}-2`,
        movieId: newMovie.id,
        hallId: h2,
        date: day.dateStr,
        time: t2,
        price: getPrice(t2, h2)
      });
    });

    const updatedSessions = [...sessions, ...newMovieSessions].filter(s => s.date >= today);
    setSessions(updatedSessions);
    saveStoredSessions(updatedSessions);

    showToast('Новый фильм успешно добавлен! Сеансы на 7 дней вперед созданы автоматически.');
  };

  const handleAddSession = (newSession) => {
    const today = new Date().toISOString().split('T')[0];
    const updated = [...sessions, newSession].filter(s => s.date >= today);
    setSessions(updated);
    saveStoredSessions(updated);
    showToast('Новый сеанс успешно запланирован!');
  };

  const handleDeleteSession = (sessionId) => {
    const today = new Date().toISOString().split('T')[0];
    const updated = sessions.filter((s) => s.id !== sessionId && s.date >= today);
    setSessions(updated);
    saveStoredSessions(updated);
    showToast('Сеанс успешно удален из расписания.');
  };

  const handleDeleteMovie = (movieId) => {
    const today = new Date().toISOString().split('T')[0];
    const updatedMovies = movies.filter((m) => m.id !== movieId);
    setMovies(updatedMovies);
    saveStoredMovies(updatedMovies);

    const updatedSessions = sessions.filter((s) => s.movieId !== movieId && s.date >= today);
    setSessions(updatedSessions);
    saveStoredSessions(updatedSessions);
    showToast('Фильм успешно снят с проката, связанные сеансы аннулированы.');
  };

  const handleCancelBooking = (bookingId) => {
    const updated = bookings.filter((b) => b.id !== bookingId);
    setBookings(updated);
    saveStoredBookings(updated);
    showToast('Бронирование успешно отменено.');
  };

  const handleUpdateUserData = (name, email) => {
    setUserName(name);
    setUserEmail(email);
    if (currentUser) {
      const updatedUser = { ...currentUser, name, email };
      setCurrentUser(updatedUser);
      localStorage.setItem('lumiere_current_user', JSON.stringify(updatedUser));
      
      const updatedList = registeredUsers.map(u => 
        u.email.toLowerCase() === currentUser.email.toLowerCase() ? updatedUser : u
      );
      setRegisteredUsers(updatedList);
      localStorage.setItem('lumiere_users', JSON.stringify(updatedList));
    }
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    setUserName(user.name);
    setUserEmail(user.email);
    setCurrentRole(user.role);
    localStorage.setItem('lumiere_current_user', JSON.stringify(user));
    showToast(`Вы успешно вошли как ${user.name}`);
  };

  const handleRegister = (newUser) => {
    const updated = [...registeredUsers, newUser];
    setRegisteredUsers(updated);
    localStorage.setItem('lumiere_users', JSON.stringify(updated));
    handleLogin(newUser);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserName('Гость');
    setUserEmail('');
    setCurrentRole('user');
    localStorage.removeItem('lumiere_current_user');
    setActiveSection('home');
    showToast('Вы вышли из учетной записи.');
  };

  const handleAddReview = (movieId, reviewText, rating, authorName) => {
    const newRev = {
      id: `rev-${Date.now()}`,
      movieId,
      userName: authorName,
      rating,
      text: reviewText,
      date: new Date().toISOString().split('T')[0],
    };

    const updated = [newRev, ...reviews];
    setReviews(updated);
    saveStoredReviews(updated);
    showToast('Спасибо! Ваш отзыв опубликован.');
  };

  const handleConfirmSeatsBooking = (seats, totalPrice) => {
    if (!bookingSession) return;

    if (!currentUser) {
      showToast('Пожалуйста, водите в аккаунт или зарегистрируйтесь, чтобы забронировать билеты!');
      setIsAuthModalOpen(true);
      return;
    }

    const newBooking = {
      id: `b-${Math.random().toString(36).substr(2, 6)}`,
      sessionId: bookingSession.id,
      userId: currentUser.email,
      userEmail: userEmail,
      seats,
      totalPrice,
      bookingTime: new Date().toISOString(),
    };

    const updated = [...bookings, newBooking];
    setBookings(updated);
    saveStoredBookings(updated);
    
    setBookingSession(null);
    setSelectedMovie(null);
    
    setActiveSection('cabinet');
    showToast('Места забронированы! Билет добавлен в Ваш Личный Кабинет.');
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const getFilteredMovies = () => {
    let result = movies;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.originalTitle.toLowerCase().includes(q) ||
          m.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    if (activeFilter === 'movies') {
    } else if (activeFilter === 'series') {
      return [];
    }

    if (selectedGenre !== 'all') {
      const targetGenre = selectedGenre.toLowerCase();
      result = result.filter((m) => {
        if (!m.tags || !Array.isArray(m.tags)) return false;
        return m.tags.some((tag) => {
          const t = tag.toLowerCase();
          if (targetGenre === 'экшн') {
            return t.includes('боевик') || t.includes('экшн') || t.includes('action');
          }
          if (targetGenre === 'анимация') {
            return t.includes('мультфильм') || t.includes('анимация') || t.includes('animation');
          }
          if (targetGenre === 'фантастика') {
            return t.includes('фантастика') || t.includes('sci-fi') || t.includes('science fiction');
          }
          return t.includes(targetGenre);
        });
      });
    }

    if (selectedDateFilter !== 'all') {
      const activeMovieIds = new Set(
        sessions.filter((s) => s.date === selectedDateFilter).map((s) => s.movieId)
      );
      result = result.filter((m) => activeMovieIds.has(m.id));
    }

    if (minRating > 0) {
      result = result.filter((m) => m.rating >= minRating);
    }

    if (sortBy === 'rating') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'year') {
      result = [...result].sort((a, b) => b.year - a.year);
    } else if (sortBy === 'title') {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  };

  const filteredMoviesList = getFilteredMovies();

  const sortOptions = [
    { value: 'rating', label: 'По рейтингу' },
    { value: 'year', label: 'По году' },
    { value: 'title', label: 'По названию' }
  ];

  const genreOptions = [
    { value: 'all', label: 'Все жанры' },
    { value: 'Экшн', label: 'Экшн / Боевики' },
    { value: 'Драма', label: 'Драма' },
    { value: 'Комедия', label: 'Комедия' },
    { value: 'Фэнтези', label: 'Фэнтези' },
    { value: 'Приключения', label: 'Приключения' },
    { value: 'Фантастика', label: 'Фантастика' },
    { value: 'Семейный', label: 'Семейный' },
    { value: 'Триллер', label: 'Триллер' },
    { value: 'Мелодрама', label: 'Мелодрама' },
    { value: 'Биография', label: 'Биография' },
    { value: 'Анимация', label: 'Анимация' }
  ];

  const dateOptions = [
    { value: 'all', label: 'Все дни' },
    ...getNextSevenDays().map((d) => ({ value: d.dateStr, label: d.label }))
  ];

  return (
    <div className="relative min-h-screen pb-16 flex flex-col font-sans select-none overflow-x-hidden">
      
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40, x: '-50%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            id="toast-notification"
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#16a34a] text-white border border-emerald-500 font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-[0_10px_30px_rgba(22,163,74,0.35)] flex items-center gap-2.5 max-w-md text-center"
          >
            <Check className="w-4 h-4 text-white flex-shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[400px] bg-gradient-to-b from-red-650/10 via-red-600/0 to-transparent pointer-events-none rounded-full blur-[80px]" />

      <header className="sticky top-0 z-30 w-full bg-[#0b0c0f]/85 backdrop-blur-md border-b border-gray-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-0">
          <div className="flex items-center justify-between w-full md:w-auto gap-4 sm:gap-10">
            <div 
              onClick={() => {
                setActiveSection('home');
                setActiveFilter('all');
              }}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-red-600 to-orange-600 flex items-center justify-center text-white font-bold tracking-tighter uppercase shadow-[0_0_15px_rgba(220,38,38,0.3)]">
                L
              </div>
              <span className="text-white font-display font-black tracking-widest text-[16px] sm:text-xl uppercase bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:to-red-500 transition-colors">
                LUMIÈRE
              </span>
            </div>

            <nav className="flex items-center gap-2.5 sm:gap-6">
              {[
                { id: 'all', label: 'ГЛАВНАЯ' },
                { id: 'movies', label: 'ФИЛЬМЫ' }
              ].map((item) => (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => {
                    setActiveSection('home');
                    setActiveFilter(item.id);
                  }}
                  className={`text-[10px] sm:text-[11px] font-bold tracking-[0.1em] sm:tracking-[0.18em] uppercase transition-colors duration-200 block cursor-pointer ${
                    activeSection === 'home' && activeFilter === item.id
                      ? 'text-red-500 font-extrabold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-3 sm:gap-6">
            
            {currentUser ? (
              <button
                onClick={() => setActiveSection('cabinet')}
                id="cabinet-nav-btn"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all text-xs font-bold cursor-pointer ${
                  activeSection === 'cabinet'
                    ? 'bg-red-600/15 border-red-500 text-red-500'
                    : 'bg-[#15161f] border-gray-800 text-gray-400 hover:border-gray-700 hover:text-white'
                }`}
                title="Личный кабинет"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{userName}</span>
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                id="auth-nav-btn"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-600/30 bg-red-650/10 hover:bg-red-650/20 text-red-400 cursor-pointer text-xs font-bold transition-all shadow-md"
                title="Войти в аккаунт"
              >
                <User className="w-3.5 h-3.5" />
                <span>Войти</span>
              </button>
            )}

            {currentRole === 'admin' && (
              <button
                onClick={() => setActiveSection('admin')}
                id="admin-nav-btn"
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  activeSection === 'admin'
                    ? 'bg-rose-900/30 border-rose-500 text-rose-300'
                    : 'bg-[#15161f] border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
                }`}
                title="Панель администратора"
              >
                <Sliders className="w-4 h-4" />
              </button>
            )}

            <div 
              onClick={() => currentUser ? setActiveSection('cabinet') : setIsAuthModalOpen(true)}
              className="w-8 h-8 rounded-full overflow-hidden border border-gray-800 bg-[#3b82f6] flex items-center justify-center cursor-pointer select-none relative group"
              title={currentUser ? "Личный кабинет" : "Войти"}
            >
              <img 
                src={currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"} 
                alt="Profile Avatar"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
            </div>

            {currentUser && (
              <button
                onClick={handleLogout}
                id="logout-nav-btn"
                className="p-2 rounded-xl border border-gray-800 bg-[#15161f] text-gray-400 hover:text-rose-450 hover:bg-rose-950/20 hover:border-rose-550/30 transition-all cursor-pointer"
                title="Выйти из аккаунта"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-12">
        <AnimatePresence mode="wait">
          
          {activeSection === 'cabinet' && (
            <motion.div
              key="cabinet"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22 }}
            >
              {currentUser ? (
                <UserCabinet
                  bookings={bookings}
                  movies={movies}
                  sessions={sessions}
                  halls={halls}
                  userName={userName}
                  userEmail={userEmail}
                  onCancelBooking={handleCancelBooking}
                  onUpdateUser={handleUpdateUserData}
                />
              ) : (
                <div id="cabinet-guest-prompt" className="bg-[#111114] border border-slate-800 rounded-3xl p-8 sm:p-12 max-w-lg mx-auto text-center space-y-6 shadow-xl">
                  <div className="w-16 h-16 rounded-2xl bg-red-650/10 border border-red-500/10 flex items-center justify-center mx-auto text-red-500">
                    <User className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black font-display text-white tracking-tight">Личный кабинет</h3>
                    <p className="text-gray-400 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
                      Пожалуйста, авторизуйтесь, чтобы посмотреть Ваши забронированные билеты, историю сеансов и управлять профилем.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-650 to-red-600 text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-lg shadow-red-950/20 hover:from-red-600 hover:to-red-550 transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    Войти в личный кабинет
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeSection === 'admin' && currentRole === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22 }}
            >
              <AdminPanel
                movies={movies}
                sessions={sessions}
                halls={halls}
                onAddMovie={handleAddMovie}
                onAddSession={handleAddSession}
                onDeleteSession={handleDeleteSession}
                onDeleteMovie={handleDeleteMovie}
              />
            </motion.div>
          )}

          {activeSection === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-10"
            >
              {activeFilter === 'all' && carouselSlides.length > 0 && activeSlide && (
                <HeroCarousel
                  carouselSlides={carouselSlides}
                  currentSlide={currentSlide}
                  setCurrentSlide={setCurrentSlide}
                  movies={movies}
                  onSelectMovie={setSelectedMovie}
                />
              )}

              <div className="space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold font-display tracking-wider text-white uppercase flex items-center gap-2">
                      <Film className="w-5 h-5 text-red-500" />
                      {activeFilter === 'movies' && 'КАТАЛОГ ПОЛНОМЕТРАЖНОГО КИНО'}
                      {activeFilter === 'all' && 'СЕЙЧАС В КИНОТЕАТРЕ'}
                    </h2>
                    <p className="text-gray-500 text-xs">
                      Нажмите на постер любого фильма, чтобы увидеть доступные сеансы, залы, цену и отзывы.
                    </p>
                  </div>
 
                  <div className="flex flex-wrap items-center gap-3">
                    <CustomDropdown
                      label="Сортировка"
                      value={sortBy}
                      options={sortOptions}
                      onChange={setSortBy}
                    />

                    <CustomDropdown
                      label="Жанр"
                      value={selectedGenre}
                      options={genreOptions}
                      onChange={setSelectedGenre}
                    />

                    <CustomDropdown
                      label="Дата"
                      value={selectedDateFilter}
                      options={dateOptions}
                      onChange={setSelectedDateFilter}
                    />

                    <div className="flex flex-col justify-center bg-[#15161f] hover:bg-[#1c1d29] border border-gray-800/80 px-4 py-2 rounded-2xl shadow-md min-w-[210px] select-none transition-colors h-[42px]">
                      <div className="flex items-center justify-between text-[10px] leading-none font-bold mb-1">
                        <span className="text-gray-400 uppercase tracking-wider">Рейтинг</span>
                        <span className="text-red-500 font-black font-mono text-xs">
                          {minRating === 0 ? 'Любой' : `★ ${minRating.toFixed(1)}+`}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.1"
                        value={minRating}
                        onChange={(e) => setMinRating(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-red-600 text-red-600"
                        id="rating-range-slider"
                      />
                    </div>

                    <div className="relative w-full sm:w-56">
                      <input
                        type="text"
                        placeholder="Поиск сеансов, жанров..."
                        value={searchQuery}
                        id="dashboard-search-query-field"
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#111114] border border-slate-800 focus:border-red-650 rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors hover:border-slate-700"
                      />
                      <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-2.5" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 pt-2">
                  {filteredMoviesList.map((movie) => (
                      <motion.div
                        key={movie.id}
                        id={`movie-poster-card-${movie.id}`}
                        onClick={() => setSelectedMovie(movie)}
                        className="group relative flex flex-col bg-[#111114] rounded-2xl overflow-hidden border border-slate-800 hover:border-red-600/40 cursor-pointer shadow-lg transition-all"
                        whileHover={{ y: -6 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="aspect-[2/3] w-full bg-slate-900 relative overflow-hidden">
                          <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-2.5 right-2.5 bg-black/75 backdrop-blur-sm border border-yellow-500/20 px-2 py-0.5 rounded-lg flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-white text-[10px] sm:text-xs font-bold font-mono">{movie.rating.toFixed(1)}</span>
                          </div>

                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-red-650 border border-red-500/40 text-white flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                              <Play className="w-5 h-5 fill-current ml-1 animate-pulse" />
                            </div>
                          </div>
                        </div>

                        <div className="p-3.5 space-y-1">
                          <h3 className="text-xs sm:text-sm font-bold text-white truncate leading-tight group-hover:text-red-500 transition-colors">
                            {movie.title}
                          </h3>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wide font-mono flex items-center justify-between">
                            <span>{movie.year}</span>
                            <span>{movie.duration}</span>
                          </p>
                        </div>
                      </motion.div>
                    ))}

                    {filteredMoviesList.length === 0 && (
                      <div className="col-span-full py-16 text-center text-gray-500 text-sm">
                        Фильмов под заданные условия поиска не обнаружено.
                      </div>
                    )}
                  </div>
              </div>

              <div className="bg-[#111114] border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 max-w-xl text-center md:text-left">
                  <h3 className="text-lg font-bold font-display text-white flex items-center justify-center md:justify-start gap-2">
                    <Sparkles className="w-5 h-5 text-red-500" />
                    Бронирование без предоплаты
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Бронируйте места на любые сеансы во всех залах кинотеатра Lumière. Оплата билетов производится непосредственно в кассе перед началом мероприятия.
                  </p>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setActiveSection('cabinet')}
                    id="info-promo-cabinet-btn"
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white border border-gray-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Мой кабинет
                  </button>
                  <button 
                    onClick={() => {
                      const m = movies.find((_m) => _m.id !== 'raya');
                      if (m) setSelectedMovie(m);
                    }}
                    id="info-promo-discover-btn"
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-red-950/20 cursor-pointer"
                  >
                    Выбрать сеанс
                  </button>
                </div>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </main>

      <AnimatePresence>
        {selectedMovie && (
          <MovieDetailModal
            movie={selectedMovie}
            sessions={sessions}
            halls={halls}
            reviews={reviews}
            initialDate={selectedDateFilter !== 'all' ? selectedDateFilter : ''}
            onClose={() => setSelectedMovie(null)}
            onBookSession={(session) => setBookingSession(session)}
            onAddReview={(text, rating, name) => handleAddReview(selectedMovie.id, text, rating, name)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {bookingSession && selectedMovie && (
          <BookingModal
            session={bookingSession}
            movie={selectedMovie}
            hall={halls.find((h) => h.id === bookingSession.hallId) || halls[0]}
            existingBookings={bookings}
            userName={userName}
            userEmail={userEmail}
            onClose={() => setBookingSession(null)}
            onSubmitBooking={handleConfirmSeatsBooking}
          />
        )}
      </AnimatePresence>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        registeredUsers={registeredUsers}
      />

      <footer className="w-full bg-[#07070a] border-t border-gray-900 py-8 text-center text-xs text-gray-500 mt-20">
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <p className="font-semibold uppercase tracking-widest text-[10px] text-gray-400">
            © 2026 Кинотеатр Lumière Cinema. Все права защищены.
          </p>
          <p className="max-w-md mx-auto leading-relaxed">
            Шикарный дизайн, смоделированный по современным платформам вещания. Тестируйте возможности бронирования билетов, добавления отзывов и администрирования сеансов.
          </p>
        </div>
      </footer>

    </div>
  );
}
