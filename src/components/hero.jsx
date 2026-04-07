import React, { useState, useEffect } from "react";
import {
  Play,
  Info,
  Star,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const Hero = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const genericHeroBg =
    "https://raw.createusercontent.com/b49cbe5e-af89-4c25-aab5-f770db9652bf/";

  // Auto-play carousel
  useEffect(() => {
    if (!movies || movies.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [movies]);

  const nextSlide = () => {
    if (!movies || movies.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  };

  const prevSlide = () => {
    if (!movies || movies.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
  };

  if (!movies || movies.length === 0) {
    return <div className="h-[90vh] bg-black animate-pulse" />;
  }

  const movie = movies[currentIndex];
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : genericHeroBg;
  const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  const ratingNum = Number(movie.vote_average);
  const rating = isNaN(ratingNum) ? "N/A" : ratingNum.toFixed(1);
  const year = movie.release_date?.split("-")[0] || "N/A";

  return (
    <div className="relative h-[95vh] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0 group"
        >
          {/* Background Image with Gradient Overlays */}
          <div className="absolute inset-0">
            <img
              src={backdropUrl}
              alt={movie.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#050505]/20 to-[#050505]" />
          </div>

          <div className="relative z-10 h-full flex flex-col justify-end pb-32 md:pb-0 md:justify-center px-6 sm:px-12 md:px-24 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-[#e50914] text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
                  Popular on LK21
                </span>
                <div className="flex items-center gap-1 text-[#e50914]">
                  <Star size={14} fill="#e50914" />
                  <span className="text-white text-sm font-bold">{rating}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400 text-sm">
                  <Calendar size={14} />
                  <span>{year}</span>
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white mb-4 md:mb-6 leading-[1.1] tracking-tighter drop-shadow-2xl">
                {movie.title}
              </h1>

              <p className="text-gray-300 text-sm sm:text-lg md:text-xl line-clamp-3 mb-6 md:mb-8 max-w-2xl leading-relaxed drop-shadow-lg">
                {movie.overview}
              </p>

              <div className="flex flex-row items-center gap-3 md:gap-4">
                <a
                  href={`/watch/${movie.id}`}
                  className="flex items-center justify-center gap-2 md:gap-3 bg-[#e50914] hover:bg-[#b20710] transition-all px-5 py-2.5 md:px-8 md:py-4 rounded-lg text-white font-bold text-sm md:text-lg shadow-xl hover:scale-105 active:scale-95"
                >
                  <Play fill="white" size={18} className="md:w-6 md:h-6" />
                  <span>Watch Now</span>
                </a>
                <button className="flex items-center justify-center gap-2 md:gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all px-5 py-2.5 md:px-8 md:py-4 rounded-lg text-white font-bold text-sm md:text-lg border border-white/20 hover:scale-105 active:scale-95">
                  <Info size={18} className="md:w-6 md:h-6" />
                  <span>More Info</span>
                </button>
              </div>
            </motion.div>
          </div>

          {/* Floating Poster for Visual Flair */}
          <div className="absolute right-24 bottom-24 hidden xl:block z-10 w-[240px] shadow-2xl rounded-xl overflow-hidden border border-white/20 rotate-3 translate-y-10 opacity-60 group-hover:opacity-100 group-hover:rotate-0 group-hover:translate-y-0 transition-all duration-500">
            <img src={posterUrl} alt={movie.title} className="w-full" />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      {movies.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm hidden md:flex items-center justify-center text-white transition-all hover:scale-110"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm hidden md:flex items-center justify-center text-white transition-all hover:scale-110"
          >
            <ChevronRight size={28} />
          </button>
        </>
      )}
    </div>
  );
};

export default Hero;
