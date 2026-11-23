import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function HeroCarousel({
  carouselSlides,
  currentSlide,
  setCurrentSlide,
  movies,
  onSelectMovie
}) {
  if (carouselSlides.length === 0) return null;
  const activeSlide = carouselSlides[currentSlide] || carouselSlides[0];

  return (
    <div
      id="featured-hero-carousel"
      className="relative rounded-3xl overflow-hidden min-h-[440px] sm:min-h-[520px] bg-[#0c0d12] border border-slate-800/60 shadow-[0_20px_50px_rgba(0,0,0,0.55)] group"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={activeSlide.backdropUrl}
            alt={activeSlide.title}
            className="absolute inset-0 w-full h-full object-cover select-none transform scale-102 transition-transform duration-1000 ease-out"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c0f] via-transparent to-black/30 z-10" />

          <div className="absolute inset-y-0 left-0 w-full md:w-3/5 p-6 sm:p-12 md:p-16 flex flex-col justify-center z-20 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-red-500 font-mono text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] block leading-none">
                {activeSlide.tagline}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase ${activeSlide.badgeColor}`}>
                {activeSlide.badge}
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight font-display leading-[1.05]">
              {activeSlide.title}
            </h1>

            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-lg">
              {activeSlide.description}
            </p>

            <div className="flex items-center gap-4 pt-4">
              <button
                onClick={() => {
                  const correspondingMovie = movies.find(m => m.id === activeSlide.id);
                  if (correspondingMovie) {
                    onSelectMovie(correspondingMovie);
                  }
                }}
                className="bg-red-600 hover:bg-red-500 text-white rounded-full px-8 py-3 text-xs tracking-wider uppercase font-extrabold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-red-950/30 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                СМОТРЕТЬ СЕАНСЫ
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute right-6 bottom-6 z-30 flex items-center gap-2">
        <button
          onClick={() => setCurrentSlide((prev) => (prev === 0 ? carouselSlides.length - 1 : prev - 1))}
          className="w-10 h-10 rounded-full bg-black/40 border border-white/10 text-white flex items-center justify-center hover:bg-red-600 hover:border-red-500/30 transition-all active:scale-90 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % carouselSlides.length)}
          className="w-10 h-10 rounded-full bg-black/40 border border-white/10 text-white flex items-center justify-center hover:bg-red-600 hover:border-red-500/30 transition-all active:scale-90 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="absolute left-6 bottom-6 sm:left-12 z-30 flex items-center gap-2">
        {carouselSlides.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              idx === currentSlide ? 'w-8 bg-red-600' : 'w-2 bg-gray-600 hover:bg-gray-400'
            }`}
            title={slide.title}
          />
        ))}
      </div>
    </div>
  );
}
