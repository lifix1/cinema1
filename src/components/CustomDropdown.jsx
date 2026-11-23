import { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CustomDropdown({ label, value, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleGlobalClick = () => setIsOpen(false);
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [isOpen]);

  const selectedOption = options.find(o => o.value === value) || options[0];

  return (
    <div className="relative inline-block select-none text-left" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2.5 bg-[#12131a] text-white font-display font-semibold hover:bg-[#181922] active:scale-98 transition-all text-xs sm:text-xs px-4 py-2 rounded-full shadow-lg border border-slate-800/60 cursor-pointer"
      >
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 font-mono text-[9px] sm:text-[10px] tracking-wider uppercase">{label}:</span>
          <span className="text-white font-black tracking-wide">{selectedOption?.label}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-3.5 h-3.5 text-slate-400 transition-transform" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 transition-transform" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 sm:left-auto sm:right-0 md:left-0 md:right-auto z-50 mt-1 min-w-[220px] bg-[#12131a] border border-slate-800 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.8)] py-2 overflow-hidden flex flex-col"
          >
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-red-650/10 text-red-500 font-extrabold'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check className="w-4 h-4 text-red-500" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
