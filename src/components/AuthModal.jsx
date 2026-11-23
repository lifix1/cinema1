import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Check, ShieldAlert, KeyRound } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLogin, onRegister, registeredUsers }) {
  const [isLoginTab, setIsLoginTab] = useState(true);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      if (isLoginTab) {
        const found = registeredUsers.find(
          (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
        );

        if (found) {
          onLogin(found);
          setEmail('');
          setPassword('');
          onClose();
        } else {
          setError('Неверный адрес почты или пароль. Попробуйте еще раз.');
        }
      } else {
        if (!name.trim()) {
          setError('Пожалуйста, введите Ваше имя');
          setLoading(false);
          return;
        }
        if (!email.trim() || !email.includes('@')) {
          setError('Пожалуйста, укажите корректный email');
          setLoading(false);
          return;
        }
        if (password.length < 4) {
          setError('Пароль должен содержать не менее 4 символов');
          setLoading(false);
          return;
        }

        const exists = registeredUsers.some(
          (u) => u.email.toLowerCase() === email.trim().toLowerCase()
        );

        if (exists) {
          setError('Пользователь с такой почтой уже зарегистрирован.');
        } else {
          const newUser = {
            email: email.trim().toLowerCase(),
            password,
            name: name.trim(),
            role: email.includes('admin') ? 'admin' : 'user',
            avatar: `https://images.unsplash.com/photo-${[
              '1534528741775-53994a69daeb',
              '1507003211169-0a1dd7228f2d',
              '1494790108377-be9c29b29330',
              '1500648767791-00dcc994a43e'
            ][Math.floor(Math.random() * 4)]}?w=100&auto=format&fit=crop&q=80`
          };
          onRegister(newUser);
          setEmail('');
          setPassword('');
          setName('');
          onClose();
        }
      }
      setLoading(false);
    }, 700);
  };

  const fillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setIsLoginTab(true);
    setError(null);
  };

  return (
    <AnimatePresence>
      <div 
        id="auth-modal-overlay"
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-md overflow-hidden bg-[#12131a] border border-slate-800 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-650 via-rose-500 to-amber-500" />

          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="p-6 sm:p-8 pt-8">
            <div className="text-center mb-6">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-red-600/10 border border-red-500/10 mb-3 text-red-500">
                <KeyRound className="w-6 h-6" />
              </span>
              <h3 className="text-2xl font-display font-black text-white tracking-tight">
                КИНОТЕАТР LUMIÈRE
              </h3>
              <p className="text-slate-400 text-xs mt-1">
                Для бронирования удобных мест и ведения истории заказов
              </p>
            </div>

            <div className="grid grid-cols-2 p-1 bg-slate-950/80 rounded-xl border border-slate-800/80 mb-6">
              <button
                onClick={() => { setIsLoginTab(true); setError(null); }}
                className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                  isLoginTab 
                    ? 'bg-red-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Вход
              </button>
              <button
                onClick={() => { setIsLoginTab(false); setError(null); }}
                className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                  !isLoginTab 
                    ? 'bg-red-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Регистрация
              </button>
            </div>

            {error && (
              <div className="flex gap-2.5 items-start bg-rose-500/5 border border-rose-500/20 text-rose-400 p-3 rounded-xl mb-4 text-xs animate-shake">
                <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLoginTab && (
                <div>
                  <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-500 mb-1.5">
                    Ваше имя
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-800/80 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-600/70 transition-colors"
                      placeholder="Константин"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-500 mb-1.5">
                  Электронная почта
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-800/80 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-600/70 transition-colors"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-500 mb-1.5">
                  Пароль
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-800/80 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-600/70 transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-650 to-red-600 hover:from-red-600 hover:to-red-550 text-white font-extrabold text-xs sm:text-sm py-3 rounded-xl shadow-lg shadow-red-950/15 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : isLoginTab ? (
                  'Войти в аккаунт'
                ) : (
                  'Зарегистрироваться'
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-800/70">
              <span className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest text-center mb-3">
                Быстрый вход для тестирования
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => fillDemo('ssp22112@gmail.com', 'password')}
                  className="px-3 py-2 bg-slate-950/40 hover:bg-slate-950/80 border border-slate-800/80 hover:border-slate-700/80 rounded-xl text-left transition-colors cursor-pointer"
                >
                  <span className="block text-[10px] font-bold text-slate-200">Зритель</span>
                  <span className="block text-[9px] text-slate-500 font-mono truncate">ssp22112@gmail.com</span>
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('admin@lumiere.ru', 'admin')}
                  className="px-3 py-2 bg-slate-950/40 hover:bg-slate-950/80 border border-slate-800/80 hover:border-slate-700/80 rounded-xl text-left transition-colors cursor-pointer"
                >
                  <span className="block text-[10px] font-bold text-rose-400">Администратор</span>
                  <span className="block text-[9px] text-slate-500 font-mono truncate">admin@lumiere.ru</span>
                </button>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
