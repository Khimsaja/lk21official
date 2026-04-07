import React from "react";
import { Star, Play, Info } from "lucide-react";
import { motion } from "motion/react";

const MovieCard = ({ movie, isTopTen, index }) => {
  const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  const ratingNum = Number(movie.vote_average);
  const rating = isNaN(ratingNum) ? "N/A" : ratingNum.toFixed(1);
  const year =
    movie.release_date?.split("-")[0] ||
    movie.first_air_date?.split("-")[0] ||
    "N/A";

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="relative group cursor-pointer shrink-0"
    >
      <a href={`/watch/${movie.id}`}>
        <div
          className={`relative ${isTopTen ? "w-[130px] h-[195px] sm:w-[150px] sm:h-[225px] md:w-[180px] md:h-[270px] z-10" : "w-[130px] h-[195px] sm:w-[150px] sm:h-[225px] md:w-[180px] md:h-[270px]"} rounded-xl overflow-hidden shadow-2xl bg-gray-900 group-hover:shadow-[#e50914]/20 transition-all`}
        >
          {movie.poster_path ? (
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 italic text-xs p-4 text-center">
              {movie.title}
            </div>
          )}
          {!isTopTen && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-[#e50914] text-white p-2 rounded-full shadow-lg">
                  <Play size={16} fill="white" />
                </div>
                <div className="bg-white/20 backdrop-blur-md text-white p-2 rounded-full">
                  <Info size={16} />
                </div>
              </div>
              <h3 className="text-white font-bold text-sm truncate">
                {movie.title}
              </h3>
              <div className="flex items-center justify-between text-[10px] text-gray-300 mt-1">
                <span className="flex items-center gap-1">
                  <Star size={10} fill="#e50914" stroke="none" /> {rating}
                </span>
                <span>{year}</span>
              </div>
            </div>
          )}
        </div>
      </a>
      {isTopTen && (
        <div className="absolute top-1/2 -translate-y-1/2 -left-8 md:-left-14 -z-10 select-none">
          <span
            className="text-[140px] md:text-[200px] font-black leading-none tracking-tighter"
            style={{
              WebkitTextFillColor: "transparent",
              WebkitTextStroke: "3px #cc0000",
              textShadow: "0 0 10px rgba(229, 9, 20, 0.2)",
            }}
          >
            {index + 1}
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default MovieCard;
