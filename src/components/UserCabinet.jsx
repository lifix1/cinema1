import { Ticket, Calendar, Clock, MapPin, QrCode, Trash2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function UserCabinet({
  bookings,
  movies,
  sessions,
  halls,
  userName,
  userEmail,
  onCancelBooking,
  onUpdateUser,
}) {

  const getBookingDetails = (booking) => {
    const session = sessions.find((s) => s.id === booking.sessionId);
    const movie = session ? movies.find((m) => m.id === session.movieId) : null;
    const hall = session ? halls.find((h) => h.id === session.hallId) : null;
    return { session, movie, hall };
  };

  return (
    <div className="space-y-8">
      <div className="bg-[#111114] border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md">
        <h2 className="text-2xl font-display font-medium text-white mb-2">
          Личный кабинет зрителя
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Просматривайте актуальное расписание сеансов и статус ваших активных билетов.
        </p>

        <form 
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1">
              Имя зрителя
            </label>
            <input
              type="text"
              value={userName}
              id="user-name-input"
              onChange={(e) => onUpdateUser(e.target.value, userEmail)}
              className="w-full bg-slate-950/80 border border-slate-850 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-600 transition-colors text-sm"
              placeholder="Ваше имя"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1">
              Электронная почта
            </label>
            <input
              type="email"
              value={userEmail}
              id="user-email-input"
              onChange={(e) => onUpdateUser(userName, e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-850 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-600 transition-colors text-sm"
              placeholder="email@example.com"
            />
          </div>
        </form>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-display font-medium text-white flex items-center gap-2">
            <Ticket className="w-5 h-5 text-red-500" />
            Мои забронированные билеты ({bookings.length})
          </h3>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-[#111114]/50 border border-dashed border-slate-800 rounded-2xl py-12 px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-600/10 flex items-center justify-center mx-auto mb-3">
              <Ticket className="w-6 h-6 text-red-500/70" />
            </div>
            <p className="text-gray-300 font-medium mb-1">У вас пока нет активных бронирований</p>
            <p className="text-gray-500 text-xs max-w-md mx-auto">
              Выберите интересующий фильм, подходящий сеанс из расписания на главной странице и забронируйте лучшие места!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {bookings.map((booking) => {
                const { session, movie, hall } = getBookingDetails(booking);
                if (!session || !movie || !hall) return null;

                return (
                  <motion.div
                    key={booking.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.25 }}
                    id={`ticket-${booking.id}`}
                    className="relative flex flex-col sm:flex-row bg-[#111114] rounded-2xl overflow-hidden border border-slate-800 shadow-lg group hover:border-red-600/30 transition-colors"
                  >
                    <div className="sm:w-36 h-48 sm:h-auto relative bg-slate-900 flex-shrink-0">
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111114] sm:from-transparent via-transparent to-transparent" />
                    </div>

                    <div className="flex-grow p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="bg-red-600/10 text-red-400 border border-red-500/20 text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold">
                            Бронь подтверждена
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-white leading-snug font-display">
                          {movie.title}
                        </h4>
                        <p className="text-gray-400 text-xs font-mono mt-0.5">{movie.originalTitle}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mt-4 text-xs text-gray-300">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                            <span>{new Date(session.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                            <span>{session.time}</span>
                          </div>
                          <div className="flex items-center gap-1.5 col-span-1 sm:col-span-2">
                            <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                            <span className="truncate">{hall.name}</span>
                          </div>
                        </div>

                        <div className="border-t border-slate-800 mt-4 pt-3 flex flex-wrap gap-x-6 gap-y-2 items-center">
                          <div>
                            <span className="text-gray-500 text-[10px] uppercase font-mono block">Ряд и места</span>
                            <span className="text-red-400 text-xs font-semibold leading-none">
                              {booking.seats.map((s) => `Ряд ${s.row + 1}, Место ${s.col + 1}`).join('; ')}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 text-[10px] uppercase font-mono block">К оплате (в кассе)</span>
                            <span className="text-emerald-400 text-sm font-semibold leading-none">
                              {booking.totalPrice} ₽
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 sm:mt-4 flex justify-end">
                        <button
                          onClick={() => onCancelBooking(booking.id)}
                          id={`cancel-btn-${booking.id}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-rose-400 bg-rose-500/5 hover:bg-rose-500/15 border border-rose-500/10 hover:border-rose-500/30 text-xs transition-all font-medium cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Вернуть билет
                        </button>
                      </div>
                    </div>

                    <div className="w-full sm:w-28 bg-slate-950/40 border-t sm:border-t-0 sm:border-l border-dashed border-slate-800 p-4 flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-3">
                      <div className="bg-white p-2 rounded-lg flex items-center justify-center shadow-md">
                        <QrCode className="w-14 h-14 text-slate-950" />
                      </div>
                      <div className="text-right sm:text-center">
                        <span className="block text-[9px] font-mono text-gray-500">КОД БРОНИ</span>
                        <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                          {booking.id.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="bg-red-650/5 border border-red-500/20 rounded-xl p-4 flex gap-3">
        <ShieldAlert className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <p className="font-semibold text-slate-200">Информация о выкупе брони:</p>
          <p>
            Бронирование мест удерживается до начала сеанса. Пожалуйста, предъявите код брони на кассе кинотеатра не позднее чем за 15 минут до начала сеанса, чтобы выкупить свои билеты. Вы можете отменить бронь в любой момент без штрафов.
          </p>
        </div>
      </div>
    </div>
  );
}
