import { useState, useEffect } from 'react';
import { Film, Calendar, Coins, Sliders, Trash2, PlusCircle, Check, Info, Sparkles, Search, Loader, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { searchMovies, getTrendingMovies, getMovieDetails } from '../lib/tmdb.js';

export default function AdminPanel({
  movies,
  sessions,
  halls,
  onAddMovie,
  onAddSession,
  onDeleteSession,
  onDeleteMovie,
}) {
  const [activeSubTab, setActiveSubTab] = useState('sessions');

  const [tmdbSearchQuery, setTmdbSearchQuery] = useState('');
  const [tmdbResults, setTmdbResults] = useState([]);
  const [tmdbLoading, setTmdbLoading] = useState(false);
  const [tmdbError, setTmdbError] = useState(null);
  const [tmdbImportingId, setTmdbImportingId] = useState(null);
  const [tmdbImportedIds, setTmdbImportedIds] = useState(() => {
    return movies.map(m => m.id);
  });
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [activeTrendingPage, setActiveTrendingPage] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchTrends = async () => {
      try {
        const trends = await getTrendingMovies();
        if (active && trends) {
          setTrendingMovies(trends);
        }
      } catch (err) {
        console.error("Failed to load TMDB Trends:", err);
      }
    };
    fetchTrends();
    return () => { active = false; };
  }, []);

  const handleTmdbSearch = async (e) => {
    if (e) e.preventDefault();
    if (!tmdbSearchQuery.trim()) return;
    
    setTmdbLoading(true);
    setTmdbError(null);
    setActiveTrendingPage(false);

    try {
      const results = await searchMovies(tmdbSearchQuery);
      setTmdbResults(results);
    } catch (err) {
      setTmdbError('Не удалось выполнить поиск. Проверьте соединение или API ключ.');
    } finally {
      setTmdbLoading(false);
    }
  };

  const handleImportTmdbMovie = async (tmdbId) => {
    setTmdbImportingId(tmdbId);
    try {
      const details = await getMovieDetails(tmdbId);
      if (details) {
        const alreadyExists = movies.some(m => m.id === details.id);
        if (alreadyExists) {
          setTmdbImportedIds(prev => [...prev, details.id]);
          return;
        }

        onAddMovie(details);
        setTmdbImportedIds(prev => [...prev, details.id]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTmdbImportingId(null);
    }
  };

  useEffect(() => {
    setTmdbImportedIds(movies.map(m => m.id));
  }, [movies]);

  const [movieTitle, setMovieTitle] = useState('');
  const [movieOrigTitle, setMovieOrigTitle] = useState('');
  const [movieYear, setMovieYear] = useState(new Date().getFullYear());
  const [movieTags, setMovieTags] = useState('');
  const [movieDuration, setMovieDuration] = useState('2 ч 00 мин');
  const [movieDesc, setMovieDesc] = useState('');
  const [moviePoster, setMoviePoster] = useState('');
  const [movieBackdrop, setMovieBackdrop] = useState('');
  const [movieShowConfirmation, setMovieShowConfirmation] = useState(false);

  const [selectedMovieId, setSelectedMovieId] = useState(movies[0]?.id || '');
  const [selectedHallId, setSelectedHallId] = useState(halls[0]?.id || '');
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [sessionTime, setSessionTime] = useState('18:00');
  const [sessionPrice, setSessionPrice] = useState(400);
  const [sessionShowConfirmation, setSessionShowConfirmation] = useState(false);

  const handleCreateMovie = (e) => {
    e.preventDefault();
    if (!movieTitle.trim()) return;

    const fallbackPoster = moviePoster.trim() || 
      'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=600&auto=format&fit=crop&q=80';
    const fallbackBackdrop = movieBackdrop.trim() || 
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600&auto=format&fit=crop&q=80';

    const tagsArr = movieTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const matchRating = Math.floor(Math.random() * 15) + 85;

    onAddMovie({
      id: `mov-${Date.now()}`,
      title: movieTitle.trim(),
      originalTitle: movieOrigTitle.trim() || movieTitle.trim(),
      year: Number(movieYear),
      match: matchRating,
      tags: tagsArr.length > 0 ? tagsArr : ['Кино'],
      duration: movieDuration,
      description: movieDesc.trim(),
      posterUrl: fallbackPoster,
      backdropUrl: fallbackBackdrop,
      rating: 4.5,
    });

    setMovieTitle('');
    setMovieOrigTitle('');
    setMovieYear(new Date().getFullYear());
    setMovieTags('');
    setMovieDuration('2 ч 00 мин');
    setMovieDesc('');
    setMoviePoster('');
    setMovieBackdrop('');
    
    setMovieShowConfirmation(true);
    setTimeout(() => setMovieShowConfirmation(false), 3000);
  };

  const handleCreateSession = (e) => {
    e.preventDefault();
    if (!selectedMovieId || !selectedHallId || !sessionDate || !sessionTime) return;

    onAddSession({
      id: `sess-${Date.now()}`,
      movieId: selectedMovieId,
      hallId: selectedHallId,
      date: sessionDate,
      time: sessionTime,
      price: Number(sessionPrice),
    });

    setSessionShowConfirmation(true);
    setTimeout(() => setSessionShowConfirmation(false), 3000);
  };

  const getMovieTitle = (id) => {
    return movies.find((m) => m.id === id)?.title || 'Неизвестный фильм';
  };

  const getHallName = (id) => {
    return halls.find((h) => h.id === id)?.name || 'Неизвестный зал';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111114] p-6 border border-slate-800 rounded-2xl">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white flex items-center gap-2">
            <Sliders className="w-6 h-6 text-red-500" />
            Панель администратора
          </h2>
          <p className="text-gray-400 text-xs mt-1">
            Конфигурируйте сетку залов кинотеатра Lumière, добавляйте релизы фильмов и планируйте сеансы расписания.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('sessions')}
            id="admin-subtab-sessions"
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'sessions'
                ? 'bg-red-600 text-white'
                : 'bg-slate-900 border border-slate-800 text-gray-400 hover:text-white'
            }`}
          >
            Список сеансов ({sessions.length})
          </button>
          <button
            onClick={() => setActiveSubTab('movies')}
            id="admin-subtab-movies"
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'movies'
                ? 'bg-red-600 text-white'
                : 'bg-slate-900 border border-slate-800 text-gray-400 hover:text-white'
            }`}
          >
            Фильмы в прокате ({movies.length})
          </button>
          <button
            onClick={() => setActiveSubTab('import-tmdb')}
            id="admin-subtab-import-tmdb"
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'import-tmdb'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-950/20'
                : 'bg-slate-900 border border-slate-800 text-gray-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Импорт TMDB [API]
          </button>
          <button
            onClick={() => setActiveSubTab('add-movie')}
            id="admin-subtab-add-movie"
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'add-movie'
                ? 'bg-red-600 text-white'
                : 'bg-slate-900 border border-slate-800 text-gray-400 hover:text-white'
            }`}
          >
            + Добавить фильм
          </button>
          <button
            onClick={() => {
              if (movies.length > 0) {
                setSelectedMovieId(movies[0].id);
              }
              setActiveSubTab('add-session');
            }}
            id="admin-subtab-add-session"
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'add-session'
                ? 'bg-red-600 text-white'
                : 'bg-slate-900 border border-slate-800 text-gray-400 hover:text-white'
            }`}
          >
            + Добавить сеанс
          </button>
        </div>
      </div>

      <div className="bg-[#111114]/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
        {activeSubTab === 'sessions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-display text-white">Действующие сеансы в расписании</h3>
              <span className="text-xs font-mono text-gray-500">
                Сортировка: Ближайшие даты
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-800 rounded-xl">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-950/70 border-b border-slate-800 text-gray-400 uppercase font-mono tracking-wider text-[10px]">
                    <th className="py-3 px-4">Фильм</th>
                    <th className="py-3 px-4">Зал</th>
                    <th className="py-3 px-4">Дата</th>
                    <th className="py-3 px-4">Время</th>
                    <th className="py-3 px-4">Базовая цена</th>
                    <th className="py-3 px-4 text-right">Действие</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {sessions
                    .sort((a,b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
                    .map((sess) => (
                      <tr 
                        key={sess.id} 
                        id={`admin-table-row-${sess.id}`}
                        className="hover:bg-slate-900/45 text-gray-200 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-semibold text-white max-w-xs truncate">
                          {getMovieTitle(sess.movieId)}
                        </td>
                        <td className="py-3.5 px-4 text-gray-400">{getHallName(sess.hallId)}</td>
                        <td className="py-3.5 px-4 font-mono">
                          {new Date(sess.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                        </td>
                        <td className="py-3.5 px-4 font-bold font-mono text-red-500">{sess.time}</td>
                        <td className="py-3.5 px-4 font-mono text-emerald-400 font-semibold">{sess.price} ₽</td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => onDeleteSession(sess.id)}
                            id={`delete-sess-btn-${sess.id}`}
                            className="bg-rose-500/10 hover:bg-rose-500/30 text-rose-400 p-2 rounded-lg border border-rose-500/20 hover:border-rose-400 transition-colors cursor-pointer"
                            title="Удалить сеанс"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}

                  {sessions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-500 text-xs">
                        Сеансы не найдены. Воспользуйтесь кнопкой «Добавить сеанс», чтобы создать новую запись.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSubTab === 'movies' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold font-display text-white">Фильмы в прокате кинотеатра</h3>
                <p className="text-gray-400 text-xs mt-0.5">
                  Управляйте активным кинокаталогом. При удалении фильма все его связанные сеансы также будут автоматически сняты с расписания.
                </p>
              </div>
              <span className="text-xs font-mono bg-[#1c1d29] px-3 py-1.5 rounded-xl border border-slate-800 text-gray-300">
                Фильмов в системе: <strong className="text-red-500">{movies.length}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {movies.map((movie) => (
                <div 
                  key={movie.id} 
                  id={`admin-movie-card-${movie.id}`}
                  className="bg-[#15161f]/60 border border-slate-800 rounded-2xl p-4 flex gap-4 hover:border-slate-700 hover:bg-[#15161f] transition-all group"
                >
                  <img 
                    src={movie.posterUrl} 
                    alt={movie.title} 
                    className="w-16 h-24 sm:w-20 sm:h-28 object-cover rounded-xl border border-slate-800 flex-shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  
                  <div className="flex-grow flex flex-col justify-between min-w-0">
                    <div>
                      <h4 className="font-bold text-white text-sm sm:text-base truncate group-hover:text-red-500 transition-all">
                        {movie.title}
                      </h4>
                      <p className="text-xs text-gray-400 font-mono truncate">
                        {movie.originalTitle || movie.title} ({movie.year})
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-md">
                          {movie.duration}
                        </span>
                        <span className="text-[10px] text-amber-500 font-bold font-mono">
                          ★ {movie.rating?.toFixed(1) || 'N/A'}
                        </span>
                      </div>
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {movie.tags?.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="text-[9px] bg-red-650/10 text-red-500 px-1.5 py-0.5 rounded border border-red-500/10">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => {
                          if (window.confirm(`Вы уверены, что хотите снять фильм «${movie.title}» с проката? Все запланированные сеансы этого фильма также будут аннулированы.`)) {
                            onDeleteMovie(movie.id);
                          }
                        }}
                        id={`delete-movie-btn-${movie.id}`}
                        className="bg-rose-500/10 hover:bg-rose-600 hover:text-white text-rose-400 text-xs font-semibold px-3 py-1.5 rounded-xl border border-rose-500/20 hover:border-transparent transition-all cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Снять с проката
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {movies.length === 0 && (
                <div className="col-span-2 text-center py-12 text-gray-500 bg-slate-950/70 border border-slate-800 rounded-2xl text-xs">
                  В прокате нет активных фильмов. Перейдите во вкладку «Импорт TMDB» или «Добавить фильм», чтобы заполнить каталог.
                </div>
              )}
            </div>
          </div>
        )}

        {activeSubTab === 'import-tmdb' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <h3 className="text-lg font-black font-display text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-rose-500 animate-pulse" />
                  Поиск и импорт из The Movie Database (TMDB)
                </h3>
                <p className="text-gray-400 text-xs mt-1">
                  Ищите любые мировые новинки или классику в базе TMDB. Импортируйте их в один клик с готовым постером, описанием, рейтингом и тегами.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-rose-950/15 border border-rose-500/20 px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold text-rose-400">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                API КЛЮЧ АКТИВЕН
              </div>
            </div>

            <form onSubmit={handleTmdbSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Введите название фильма по-русски или по-английски... (например: Интерстеллар)"
                  value={tmdbSearchQuery}
                  onChange={(e) => setTmdbSearchQuery(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-rose-500/50 rounded-2xl pl-11 pr-4 py-3 text-white focus:outline-none text-xs sm:text-sm transition-colors"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={tmdbLoading}
                  className="px-6 py-3 bg-rose-600 hover:bg-rose-500 disabled:bg-rose-800 text-white font-bold text-xs sm:text-sm rounded-2xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  {tmdbLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  <span>Найти</span>
                </button>
                {!activeTrendingPage && (
                  <button
                    type="button"
                    onClick={() => {
                      setTmdbSearchQuery('');
                      setActiveTrendingPage(true);
                      setTmdbResults([]);
                    }}
                    className="px-4 py-3 bg-slate-900 border border-slate-800 hover:border-slate-700 text-gray-400 hover:text-white font-bold text-xs sm:text-sm rounded-2xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Тренды</span>
                  </button>
                )}
              </div>
            </form>

            {tmdbError && (
              <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl text-xs text-rose-400 flex gap-2">
                <Info className="w-4 h-4 flex-shrink-0" />
                <span>{tmdbError}</span>
              </div>
            )}

            <div>
              <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-gray-500 mb-4 flex items-center gap-2">
                {activeTrendingPage ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Популярно сегодня в мире (Тренды TMDB)
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Результаты поиска по запросу «{tmdbSearchQuery}» ({tmdbResults.length})
                  </>
                )}
              </h4>

              {tmdbLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <div className="w-10 h-10 border-4 border-rose-500/20 border-t-rose-600 rounded-full animate-spin" />
                  <p className="text-gray-400 text-xs font-mono">Выполняем безопасный поиск в базе TMDB...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {(activeTrendingPage ? trendingMovies : tmdbResults).map((movie) => {
                      const completeId = `tmdb-${movie.id}`;
                      const isAlreadyImported = tmdbImportedIds.includes(completeId);
                      const isImporting = tmdbImportingId === movie.id;

                      return (
                        <div
                          key={movie.id}
                          className="group relative flex flex-col bg-[#0b0c10]/80 border border-slate-850 rounded-2xl overflow-hidden shadow-lg hover:border-slate-750 transition-all hover:scale-[1.02]"
                        >
                          <div className="relative aspect-[2/3] w-full bg-slate-950 overflow-hidden">
                            <img
                              src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=500&auto=format&fit=crop&q=80'}
                              alt={movie.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                              referrerPolicy="no-referrer"
                            />

                            {movie.vote_average > 0 && (
                              <div className="absolute top-2.5 left-2.5 px-2 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[10px] font-black font-mono text-amber-400 flex items-center gap-0.5 shadow-md">
                                <span>★</span>
                                <span>{(movie.vote_average / 2).toFixed(1)}</span>
                              </div>
                            )}

                            {movie.release_date && (
                              <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-slate-950/85 text-[10px] font-bold font-mono text-gray-400 shadow-md">
                                {movie.release_date.split('-')[0]}
                              </div>
                            )}

                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent p-3 pt-10 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                              <p className="text-[10px] leading-relaxed text-gray-300 line-clamp-4">
                                {movie.overview || 'Сюжетное описание для этого фильма пока не добавлено на русском языке.'}
                              </p>
                            </div>
                          </div>

                          <div className="p-3.5 flex-grow flex flex-col justify-between gap-3">
                            <div className="space-y-1">
                              <h5 className="text-xs font-black text-white leading-tight line-clamp-1 group-hover:text-rose-450 transition-colors" title={movie.title}>
                                {movie.title}
                              </h5>
                              <p className="text-[9px] font-mono text-gray-500 line-clamp-1" title={movie.original_title}>
                                {movie.original_title}
                              </p>
                            </div>

                            {isAlreadyImported ? (
                              <div className="w-full py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-[10px] font-extrabold flex items-center justify-center gap-1">
                                <Check className="w-3.5 h-3.5" />
                                <span>Импортирован</span>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleImportTmdbMovie(movie.id)}
                                disabled={isImporting}
                                className="w-full py-2 bg-slate-900 hover:bg-rose-600 border border-slate-800 hover:border-rose-500 text-gray-300 hover:text-white rounded-xl text-[10px] font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1 active:scale-[0.96] shadow-sm select-none"
                              >
                                {isImporting ? (
                                  <Loader className="w-3 h-3 animate-spin text-white" />
                                ) : (
                                  <PlusCircle className="w-3 h-3" />
                                )}
                                <span>{isImporting ? 'Импорт...' : 'Добавить'}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {!activeTrendingPage && tmdbResults.length === 0 && (
                      <div className="col-span-full py-16 text-center border border-dashed border-slate-800 rounded-3xl space-y-2">
                        <Film className="w-8 h-8 text-gray-500 mx-auto" />
                        <p className="text-gray-400 text-xs sm:text-sm font-semibold">Фильмы не найдены</p>
                        <p className="text-gray-500 text-[11px] max-w-xs mx-auto leading-relaxed">
                          Убедитесь, что название введено корректно, или нажмите кнопку «Тренды», чтобы сбросить фильтр.
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {activeSubTab === 'add-movie' && (
          <form onSubmit={handleCreateMovie} id="admin-movie-form" className="space-y-6 max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Film className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-bold font-display text-white">Добавить новый кинофильм</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Название фильма (Рус.) *</label>
                <input
                  type="text"
                  required
                  placeholder="Пример: Дэдпул и Росомаха"
                  value={movieTitle}
                  id="admin-form-movie-title"
                  onChange={(e) => setMovieTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-red-650 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Оригинальное название *</label>
                <input
                  type="text"
                  placeholder="Пример: Deadpool & Wolverine"
                  value={movieOrigTitle}
                  id="admin-form-movie-origtitle"
                  onChange={(e) => setMovieOrigTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-red-650 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Год выпуска *</label>
                <input
                  type="number"
                  min="1900"
                  max="2030"
                  required
                  value={movieYear}
                  id="admin-form-movie-year"
                  onChange={(e) => setMovieYear(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-red-650 text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Продолжительность *</label>
                <input
                  type="text"
                  required
                  placeholder="Пример: 2 ч 04 мин"
                  value={movieDuration}
                  id="admin-form-movie-duration"
                  onChange={(e) => setMovieDuration(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-red-650 text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Жанры (Через запятую) *</label>
                <input
                  type="text"
                  placeholder="Экшн, Комедия, Триллер"
                  value={movieTags}
                  id="admin-form-movie-tags"
                  onChange={(e) => setMovieTags(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-red-650 text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Ссылка на постер (URL) *</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={moviePoster}
                  id="admin-form-movie-poster"
                  onChange={(e) => setMoviePoster(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-red-650 text-sm text-gray-400 font-mono"
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  Оставьте пустым для автогенерации красивого премиум-постера.
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Ссылка на бэкдроп фоновый арт (URL) *</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={movieBackdrop}
                  id="admin-form-movie-backdrop"
                  onChange={(e) => setMovieBackdrop(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-red-650 text-sm text-gray-400 font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Описание сюжета *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Введите синопсис кинофильма..."
                  value={movieDesc}
                  id="admin-form-movie-desc"
                  onChange={(e) => setMovieDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-red-650 text-sm leading-relaxed duration-200 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                id="sumbit-new-movie-btn"
                className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-red-950/20 flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                Создать фильм
              </button>
              
              <AnimatePresence>
                {movieShowConfirmation && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-emerald-400 text-xs font-medium flex items-center gap-1"
                  >
                    <Check className="w-4 h-4" /> Фильм успешно добавлен в каталог!
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </form>
        )}

        {activeSubTab === 'add-session' && (
          <form onSubmit={handleCreateSession} id="admin-session-form" className="space-y-6 max-w-xl">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-bold font-display text-white">Запланировать сеанс</h3>
            </div>

            {movies.length === 0 ? (
              <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 p-4 rounded-xl text-xs flex gap-2">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                Сначала добавьте хотя бы один фильм в систему, чтобы запланировать сеанс.
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Выберите кинофильм *</label>
                  <select
                    value={selectedMovieId}
                    id="admin-form-sess-movie"
                    onChange={(e) => setSelectedMovieId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-red-650 text-sm"
                  >
                     {movies.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.title} ({m.year})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Зал кинотеатра *</label>
                  <select
                    value={selectedHallId}
                    id="admin-form-sess-hall"
                    onChange={(e) => setSelectedHallId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-red-650 text-sm"
                  >
                    {halls.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name} ({h.rows} рядов × {h.cols} мест)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Дата сеанса *</label>
                    <input
                      type="date"
                      required
                      value={sessionDate}
                      id="admin-form-sess-date"
                      onChange={(e) => setSessionDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-red-650 text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Время начала *</label>
                    <input
                      type="time"
                      required
                      value={sessionTime}
                      id="admin-form-sess-time"
                      onChange={(e) => setSessionTime(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-red-650 text-sm font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                    Базовая стоимость билета (₽) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="100"
                      max="4000"
                      value={sessionPrice}
                      id="admin-form-sess-price"
                      onChange={(e) => setSessionPrice(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-white focus:outline-none focus:border-red-650 text-sm font-mono"
                    />
                    <Coins className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">
                    VIP-места в выбранном залом получат наценку 50% автоматически.
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <button
                    type="submit"
                    id="submit-sess-btn"
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-red-950/20 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    Запланировать
                  </button>

                  <AnimatePresence>
                    {sessionShowConfirmation && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-emerald-400 text-xs font-medium flex items-center gap-1"
                      >
                        <Check className="w-4 h-4" /> Сеанс добавлен в календарь!
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
