import { useState, useEffect } from 'react';
import { Play, Plus, X, Star, Calendar, MessageSquare, Clock, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function MovieDetailModal({
  movie,
  sessions,
  halls,
  reviews,
  onClose,
  onBookSession,
  onAddReview,
  initialDate,
}) {
  const [activeTab, setActiveTab] = useState('sessions');
  
  const [reviewName, setReviewName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(null);

  const movieSessions = sessions.filter((s) => s.movieId === movie.id);
  
  const getUniqueDates = () => {
    const dates = Array.from(new Set(movieSessions.map((s) => s.date)));
    return dates.sort();
  };

  const datesList = getUniqueDates();
  const defaultDate = initialDate && datesList.includes(initialDate) ? initialDate : (datesList[0] || '');
  const [selectedDate, setSelectedDate] = useState(defaultDate);

  useEffect(() => {
    const currentDates = getUniqueDates();
    if (initialDate && currentDates.includes(initialDate)) {
      setSelectedDate(initialDate);
    } else if (!selectedDate || !currentDates.includes(selectedDate)) {
      setSelectedDate(currentDates[0] || '');
    }
  }, [movie.id, sessions, initialDate]);

  const filteredSessions = movieSessions
    .filter((s) => s.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  const getHallName = (hallId) => {
    return halls.find((h) => h.id === hallId)?.name || 'Основной зал';
  };

  const movieReviews = reviews.filter((r) => r.movieId === movie.id);
  const averageRating = movieReviews.length
    ? (movieReviews.reduce((sum, r) => sum + r.rating, 0) / movieReviews.length).toFixed(1)
    : movie.rating.toFixed(1);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    onAddReview(reviewText, reviewRating, reviewName.trim() || 'Анонимный зритель');
    setReviewText('');
    setReviewName('');
    setReviewRating(5);
  };

  const formatTabDate = (dateStr) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrowObj = new Date();
    tomorrowObj.setDate(tomorrowObj.getDate() + 1);
    const tomorrowStr = tomorrowObj.toISOString().split('T')[0];

    if (dateStr === todayStr) return 'Сегодня';
    if (dateStr === tomorrowStr) return 'Завтра';
    
    return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        className="absolute inset-0 bg-[#060609]/90 backdrop-blur-md" 
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        id="movie-details-modal-box"
        className="relative bg-[#111114] border border-slate-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[92vh]"
      >
        <button
          onClick={onClose}
          id="close-details-modal"
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/40 border border-gray-700/40 text-gray-300 hover:text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/60 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto flex-grow">
          <div className="relative h-64 sm:h-96 w-full flex-shrink-0 bg-slate-900 group">
            <img
              src={movie.backdropUrl}
              alt={movie.title}
              className="w-full h-full object-cover select-none"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111114] via-[#111114]/40 to-black/35" />

            <div className="absolute bottom-6 left-6 right-6 sm:left-10 sm:right-10 z-10">
              {movie.id === 'raya' ? (
                <span className="text-red-500 font-mono text-[11px] uppercase tracking-widest block font-bold mb-2">
                  Оригинальный фильм Disney
                </span>
              ) : (
                <span className="text-red-500 font-mono text-[11px] uppercase tracking-widest block font-bold mb-2">
                  Шедевр мирового кинематографа
                </span>
              )}
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase font-display leading-tight max-w-2xl">
                {movie.title}
              </h1>
              
              <div className="flex items-center gap-4 mt-3 text-xs sm:text-sm text-gray-300">
                {['john-wick', 'casablanca', 'crazy-stupid-love'].includes(movie.id) ? (
                  <span className="text-amber-400 font-bold font-mono text-xs px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded font-display select-none">
                    АКЦИЯ
                  </span>
                ) : (['raya', 'blade-runner', 'bohemian-rhapsody'].includes(movie.id) || movie.year >= 2017) ? (
                  <span className="text-indigo-400 font-bold font-mono text-xs px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded font-display select-none">
                    НОВИНКА
                  </span>
                ) : null}
                <span className="text-gray-400 font-mono">{movie.year}</span>
                <span className="text-gray-400 font-mono">{movie.duration}</span>
                <span className="bg-slate-800 text-gray-300 text-[10px] font-bold px-2 py-0.5 rounded font-mono">12+</span>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => {
                    if (datesList.length > 0) {
                      setActiveTab('sessions');
                      document.getElementById('details-tab-anchors')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  id="action-btn-play"
                  className="bg-red-600 hover:bg-red-500 text-white rounded-full px-8 py-2.5 font-bold font-display uppercase text-xs tracking-wider flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-red-950/40 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  КУПИТЬ БИЛЕТ
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-10 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 border-b border-gray-800/60 pb-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {movie.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="bg-slate-800/40 border border-gray-700/50 text-gray-300 text-xs px-3 py-1 rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {movie.description}
                </p>
              </div>

              <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-4 flex flex-col justify-center space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-xs font-mono uppercase">Оценка зрителей</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-white text-sm font-bold">{averageRating} / 5</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-xs font-mono uppercase">Всего отзывов</span>
                  <span className="text-white text-sm font-semibold">{movieReviews.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-xs font-mono uppercase">Релиз</span>
                  <span className="text-white text-sm font-semibold font-mono">{movie.year} год</span>
                </div>
              </div>
            </div>

            <div id="details-tab-anchors" className="flex border-b border-slate-805">
              <button
                onClick={() => setActiveTab('sessions')}
                id="tab-btn-sessions"
                className={`pb-4 px-2 text-sm font-bold tracking-wider relative transition-colors cursor-pointer ${
                  activeTab === 'sessions' ? 'text-red-500' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                РАСПИСАНИЕ СЕАНСОВ
                {activeTab === 'sessions' && (
                  <motion.div 
                    layoutId="activeTabUnderline" 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-650" 
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                id="tab-btn-reviews"
                className={`ml-8 pb-4 px-2 text-sm font-bold tracking-wider relative transition-colors cursor-pointer ${
                  activeTab === 'reviews' ? 'text-red-500' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                ОТЗЫВЫ ЗРИТЕЛЕЙ ({movieReviews.length})
                {activeTab === 'reviews' && (
                  <motion.div 
                    layoutId="activeTabUnderline" 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-650" 
                  />
                )}
              </button>
            </div>

            <div>
              {activeTab === 'sessions' ? (
                <div className="space-y-6">
                  {datesList.length === 0 ? (
                    <div className="py-8 text-center bg-slate-950/20 border border-dashed border-gray-800 rounded-xl px-4">
                      <Calendar className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">Актуальные сеансы отсутствуют.</p>
                      <p className="text-gray-600 text-xs mt-1">Ожидайте, администраторы кинотеатра скоро обновят расписание!</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex flex-wrap gap-2 pb-1">
                        {datesList.map((dt) => (
                          <button
                            key={dt}
                            id={`date-tab-${dt}`}
                            onClick={() => setSelectedDate(dt)}
                            className={`px-4 py-2 text-xs font-bold rounded-xl border font-mono transition-colors cursor-pointer ${
                              selectedDate === dt
                                ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-950/10'
                                : 'bg-[#12131a]/55 text-slate-400 border-slate-805 hover:bg-[#12131a] hover:border-gray-750'
                            }`}
                          >
                            {formatTabDate(dt)}
                          </button>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredSessions.map((session) => (
                          <div
                            key={session.id}
                            id={`session-card-${session.id}`}
                            className="bg-slate-950/45 border border-slate-805 rounded-2xl p-4 flex items-center justify-between group hover:border-red-600/20 transition-colors"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-red-500" />
                                <span className="text-lg font-bold text-white font-mono">{session.time}</span>
                              </div>
                              <p className="text-xs text-gray-400 font-medium truncate max-w-[200px]">
                                {getHallName(session.hallId)}
                              </p>
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <span className="text-slate-500 text-[10px] block font-mono">БИЛЕТ ОТ</span>
                                <span className="text-emerald-400 text-sm font-bold font-mono">{session.price} ₽</span>
                              </div>

                              <button
                                onClick={() => onBookSession(session)}
                                id={`book-sess-btn-${session.id}`}
                                className="px-4 py-2 bg-red-600/15 text-red-400 border border-red-500/10 hover:bg-red-600 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                              >
                                К местам
                              </button>
                            </div>
                          </div>
                        ))}

                        {filteredSessions.length === 0 && (
                          <div className="col-span-1 md:col-span-2 py-6 text-center text-gray-500 text-sm font-medium">
                            На эту дату сеансов не найдено
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-7 space-y-4 max-h-[450px] overflow-y-auto pr-1">
                    {movieReviews.length === 0 ? (
                      <div className="py-8 text-center text-gray-500 text-sm bg-slate-950/15 border border-dashed border-slate-800 rounded-xl px-4">
                        <MessageSquare className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                        У этого фильма пока нет отзывов. Будьте первым, кто поделится своим мнением!
                      </div>
                    ) : (
                      movieReviews.map((rev) => (
                        <div
                          key={rev.id}
                          className="bg-[#111114]/55 border border-slate-800 rounded-2xl p-4 space-y-2"
                        >
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <span className="font-bold text-gray-200 text-sm">{rev.userName}</span>
                            <span className="text-slate-500 text-xs font-mono">
                              {new Date(rev.date).toLocaleDateString('ru-RU')}
                            </span>
                          </div>

                          <div className="flex items-center gap-0.5" aria-label={`Рейтинг ${rev.rating} звёзд`}>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < rev.rating
                                    ? 'text-yellow-500 fill-current'
                                    : 'text-gray-700'
                                  }`}
                              />
                            ))}
                          </div>

                          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                            {rev.text}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="lg:col-span-5 bg-[#111114] border border-slate-800 rounded-2xl p-5 sticky top-0 space-y-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-display">
                      <Sparkles className="w-4 h-4 text-red-500" />
                      Поделитесь впечатлением
                    </h3>

                    <form onSubmit={handleReviewSubmit} id="write-review-form" className="space-y-4">
                      <div>
                        <label className="block text-[11px] font-mono uppercase text-gray-500 mb-1">
                          Какое ваше имя?
                        </label>
                        <input
                          type="text"
                          required
                          value={reviewName}
                          id="review-name-field"
                          onChange={(e) => setReviewName(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-red-650 transition-colors"
                          placeholder="Пример: Александр С."
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono uppercase text-gray-500 mb-1">
                          Ваш рейтинг фильма
                        </label>
                        <div className="flex items-center gap-1.5" role="group" aria-label="Рейтинг в звёздах">
                          {Array.from({ length: 5 }).map((_, i) => {
                            const val = i + 1;
                            const isFilled = hoverRating !== null ? val <= hoverRating : val <= reviewRating;
                            return (
                              <button
                                key={i}
                                type="button"
                                id={`review-star-btn-${val}`}
                                onMouseEnter={() => setHoverRating(val)}
                                onMouseLeave={() => setHoverRating(null)}
                                onClick={() => setReviewRating(val)}
                                className="text-2xl text-yellow-500 focus:outline-none transition-transform hover:scale-125 cursor-pointer"
                              >
                                <Star className={`w-6 h-6 ${isFilled ? 'fill-current' : 'text-gray-700'}`} />
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono uppercase text-gray-500 mb-1">
                          Текст отзыва
                        </label>
                        <textarea
                          placeholder="Текст вашего отзыва... Что вам понравилось или не понравилось в фильме?"
                          required
                          rows={4}
                          value={reviewText}
                          id="review-text-field"
                          onChange={(e) => setReviewText(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-red-650 transition-colors resize-none leading-relaxed"
                        />
                      </div>

                      <button
                        type="submit"
                        id="submit-review-btn"
                        className="w-full bg-[#e11d48] hover:bg-rose-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Опубликовать отзыв
                      </button>
                    </form>
                  </div>

                </div>
              )}
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
