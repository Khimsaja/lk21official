import React, { useRef } from "react";
import MovieCard from "./movie-card";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MovieRow = ({ title, movies, isTopTen, viewMoreLink }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (!current) return;
    const scrollAmount =
      direction === "left"
        ? -current.clientWidth + 100
        : current.clientWidth - 100;
    current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="mb-12 relative group/row">
      {isTopTen ? (
        <div className="flex items-center gap-4 mb-10 px-4 md:px-12">
          <h2
            className="text-white text-6xl md:text-8xl font-black tracking-tighter"
            style={{
              WebkitTextFillColor: "transparent",
              WebkitTextStroke: "2px #e50914",
            }}
          >
            TOP 10
          </h2>
          <div className="flex flex-col justify-center leading-tight">
            <span className="text-white text-sm md:text-xl font-bold tracking-[0.2em] uppercase">
              Content
            </span>
            <span className="text-white text-sm md:text-xl font-bold tracking-[0.2em] uppercase">
              Today
            </span>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-end mb-6 px-4 md:px-12">
          <h2 className="text-white text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2">
            <span className="w-1 h-6 bg-[#e50914] block mr-2" />
            {title}
          </h2>
          {viewMoreLink && (
            <a href={viewMoreLink} className="text-sm font-bold text-gray-400 hover:text-white flex items-center gap-1 transition-colors mb-1">
              See All <ChevronRight size={16} />
            </a>
          )}
        </div>
      )}

      <div className="relative">
        {/* Scroll Buttons - Always visible on hover (Desktop only) */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-12 h-24 bg-black/80 hover:bg-black/90 opacity-0 group-hover/row:opacity-100 transition-all hidden md:flex items-center justify-center text-white rounded-r-lg shadow-2xl"
          aria-label="Scroll left"
        >
          <ChevronLeft size={32} strokeWidth={3} />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-12 h-24 bg-black/80 hover:bg-black/90 opacity-0 group-hover/row:opacity-100 transition-all hidden md:flex items-center justify-center text-white rounded-l-lg shadow-2xl"
          aria-label="Scroll right"
        >
          <ChevronRight size={32} strokeWidth={3} />
        </button>

        <div
          ref={scrollRef}
          className={`flex gap-4 overflow-x-auto no-scrollbar scroll-smooth px-4 md:px-12 touch-pan-x overscroll-x-contain ${
            isTopTen ? "pb-12 pt-6 gap-x-8 md:gap-x-12 pl-12 md:pl-24" : "pb-8"
          }`}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {movies.map((movie, index) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isTopTen={isTopTen}
              index={index}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default MovieRow;
