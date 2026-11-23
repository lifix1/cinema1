import { useState } from 'react';
import { ShoppingBag, X, Users, Compass, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function BookingModal({
  session,
  movie,
  hall,
  existingBookings,
  userName,
  userEmail,
  onClose,
  onSubmitBooking,
}) {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const occupiedSeatsSet = new Set();
  existingBookings
    .filter((b) => b.sessionId === session.id)
    .forEach((b) => {
      b.seats.forEach((seat) => {
        occupiedSeatsSet.add(`${seat.row}-${seat.col}`);
      });
    });

  const isVipSeat = (rowIndex) => {
    return hall.vipRows?.includes(rowIndex) || false;
  };

  const getSeatPrice = (rowIndex) => {
    return isVipSeat(rowIndex) ? Math.round(session.price * 1.5) : session.price;
  };

  const handleSeatClick = (rowIndex, colIndex) => {
    const seatId = `${rowIndex}-${colIndex}`;
    if (occupiedSeatsSet.has(seatId)) return;

    const isSelected = selectedSeats.some((s) => s.row === rowIndex && s.col === colIndex);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((s) => !(s.row === rowIndex && s.col === colIndex)));
    } else {
      setSelectedSeats([...selectedSeats, { row: rowIndex, col: colIndex }]);
    }
  };

  const totalCost = selectedSeats.reduce((sum, seat) => sum + getSeatPrice(seat.row), 0);

  const handleBook = () => {
    if (selectedSeats.length === 0) return;
    onSubmitBooking(selectedSeats, totalCost);
  };

  const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="absolute inset-0 bg-[#050508]/85 backdrop-blur-md" 
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        id="booking-modal-container"
        className="relative bg-[#111114] border border-slate-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]"
      >
        <div className="p-6 pb-4 border-b border-slate-850 flex items-start justify-between">
          <div>
            <span className="text-red-500 text-xs font-mono font-semibold uppercase tracking-wider block mb-1">
              Бронирование мест
            </span>
            <h3 className="text-2xl font-bold font-display text-white">
              {movie.title}
            </h3>
            <p className="text-slate-400 text-xs mt-1 flex flex-wrap gap-x-4 items-center">
              <span>{hall.name}</span>
              <span className="w-1 h-1 rounded-full bg-slate-600 block" />
              <span>{new Date(session.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</span>
              <span className="w-1 h-1 rounded-full bg-slate-600 block" />
              <span className="text-red-400 font-semibold">{session.time}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            id="close-booking-modal"
            className="w-10 h-10 rounded-full bg-slate-800/55 text-gray-400 hover:text-white flex items-center justify-center border border-gray-700/50 hover:bg-slate-700/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 flex flex-col items-center">
          <div className="w-full max-w-xl mb-16 mt-4 relative text-center">
            <div className="h-4 w-full border-t-2 border-red-500/80 rounded-[50%/20px] bg-gradient-to-b from-red-600/10 to-transparent block shadow-[0_10px_20px_-10px_rgba(220,38,38,0.3)]" />
            <span className="text-[10px] font-mono font-bold tracking-[0.5em] text-red-500/80 uppercase block mt-3">ЭКРАН</span>
          </div>

          <div className="space-y-3 w-full max-w-2xl px-4 overflow-x-auto pb-6">
            {Array.from({ length: hall.rows }).map((_, rowIndex) => {
              const rowLabel = rowLetters[rowIndex] || `${rowIndex + 1}`;
              const isVipRow = isVipSeat(rowIndex);

              return (
                <div key={rowIndex} className="flex items-center justify-center gap-3 min-w-max">
                  <span className="w-6 font-mono text-xs text-slate-500 text-center select-none font-bold">
                    {rowIndex + 1}
                  </span>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: hall.cols }).map((_, colIndex) => {
                      const seatId = `${rowIndex}-${colIndex}`;
                      const isOccupied = occupiedSeatsSet.has(seatId);
                      const isSelected = selectedSeats.some(
                        (s) => s.row === rowIndex && s.col === colIndex
                      );

                      let btnClass = "";
                      if (isOccupied) {
                        btnClass = "bg-slate-800 text-slate-900 border border-slate-700/50 cursor-not-allowed";
                      } else if (isSelected) {
                        btnClass = "bg-gradient-to-br from-red-600 to-red-800 text-white border-red-500 font-bold shadow-[0_0_12px_rgba(220,38,38,0.5)]";
                      } else if (isVipRow) {
                        btnClass = "bg-amber-950/20 text-yellow-300 border-yellow-500/40 hover:bg-yellow-500/20 hover:border-yellow-400";
                      } else {
                        btnClass = "bg-slate-900/40 text-gray-400 border-slate-700/60 hover:bg-red-950/25 hover:border-red-650/40";
                      }

                      return (
                        <button
                          key={colIndex}
                          id={`seat-cell-${rowIndex}-${colIndex}`}
                          onClick={() => handleSeatClick(rowIndex, colIndex)}
                          disabled={isOccupied}
                          className={`w-8 h-8 rounded-lg text-xs flex items-center justify-center border transition-all select-none cursor-pointer ${btnClass}`}
                          title={
                            isOccupied
                              ? `Ряд ${rowIndex + 1}, Место ${colIndex + 1} (Занято)`
                              : `Ряд ${rowIndex + 1}, Место ${colIndex + 1} (${isVipRow ? 'VIP' : 'Стандарт'}: ${getSeatPrice(rowIndex)}₽)`
                          }
                        >
                          {colIndex + 1}
                        </button>
                      );
                    })}
                  </div>

                  <span className="w-6 font-mono text-xs text-slate-500 text-center select-none font-bold">
                    {rowIndex + 1}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 p-4 bg-slate-950/40 border border-slate-850 rounded-2xl w-full max-w-2xl text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-slate-900/40 border border-slate-700/60" />
              <span>Стандарт ({session.price} ₽)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-amber-950/20 border border-yellow-500/40" />
              <span>VIP (+50% / {Math.round(session.price * 1.5)} ₽)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-gradient-to-r from-red-600 to-red-800 border border-red-500" />
              <span>Ваш выбор</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-slate-800 border border-slate-700/50" />
              <span className="text-gray-500">Занято</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-[#0A0A0B] border-t border-slate-850 flex flex-col md:flex-row gap-5 items-center justify-between">
          <div className="w-full md:w-auto text-center md:text-left">
            {selectedSeats.length === 0 ? (
              <p className="text-gray-500 text-sm">Выберите хотя бы одно свободное место для бронирования</p>
            ) : (
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-mono">ВЫБРАННЫЕ МЕСТА ({selectedSeats.length}):</p>
                <p className="text-red-400 text-sm font-semibold">
                  {selectedSeats
                    .map((s) => `Ряд ${s.row + 1}, Место ${s.col + 1}${isVipSeat(s.row) ? ' (VIP)' : ''}`)
                    .join('; ')}
                </p>
                <div className="text-lg text-white font-semibold">
                  Итоговая стоимость:{' '}
                  <span className="text-emerald-400 font-bold font-display text-2xl">
                    {totalCost} ₽
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 w-full md:w-auto justify-end">
            <button
              onClick={onClose}
              id="cancel-booking-flow"
              className="px-5 py-2.5 rounded-xl border border-slate-800 text-gray-400 hover:text-white hover:bg-slate-950/30 text-sm transition-all font-medium cursor-pointer"
            >
              Отмена
            </button>
            <button
              onClick={handleBook}
              id="confirm-booking-btn"
              disabled={selectedSeats.length === 0}
              className={`px-6 py-2.5 rounded-xl text-white font-medium text-sm flex items-center gap-2 transition-all ${
                selectedSeats.length === 0
                  ? 'bg-red-950/20 border border-red-500/10 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-600 to-[#ea580c] hover:from-red-500 hover:to-orange-500 border border-red-500/30 [box-shadow:0_4px_15px_rgba(220,38,38,0.35)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Подтвердить бронирование
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
