import React, { useState } from "react";
import Header from "../components/header";
import Hero from "../components/hero";
import MovieRow from "../components/movie-row";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";

const fetchMovies = async (type, query = "") => {
  const url = `/api/movies?type=${type}${query ? `&q=${encodeURIComponent(query)}` : ""}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch movies");
  return response.json();
};

const fetchSeries = async (type, query = "") => {
  const url = `/api/series?type=${type}${query ? `&q=${encodeURIComponent(query)}` : ""}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch series");
  return response.json();
};

export default function MoviePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const logoUrl =
    "https://raw.createusercontent.com/be84bc4b-495b-44a7-94a0-32ee6dc4938c/";

  const { data: trending, isLoading: isTrendingLoading } = useQuery({
    queryKey: ["movies", "trending"],
    queryFn: () => fetchMovies("trending"),
  });

  const { data: latest, isLoading: isLatestLoading } = useQuery({
    queryKey: ["movies", "latest"],
    queryFn: () => fetchMovies("latest"),
  });

  const { data: popular, isLoading: isPopularLoading } = useQuery({
    queryKey: ["movies", "popular"],
    queryFn: () => fetchMovies("popular"),
  });

  const { data: animeSeries } = useQuery({
    queryKey: ["series", "anime"],
    queryFn: () => fetchSeries("anime"),
  });

  const { data: kdramaSeries } = useQuery({
    queryKey: ["series", "kdrama"],
    queryFn: () => fetchSeries("kdrama"),
  });

  const { data: popularSeries } = useQuery({
    queryKey: ["series", "popular"],
    queryFn: () => fetchSeries("popular"),
  });

  const { data: searchResults, isLoading: isSearchLoading } = useQuery({
    queryKey: ["movies", "search", searchQuery],
    queryFn: () => fetchMovies("search", searchQuery),
    enabled: !!searchQuery,
  });

  const featuredMovies = trending?.results?.slice(0, 5) || []; // Pass 5 movies for carousel
  const topTenMovies = trending?.results?.slice(0, 10) || [];
  const latestMovies = latest?.results || [];
  const popularMovies = popular?.results || [];
  const animes = animeSeries?.results || [];
  const kdramas = kdramaSeries?.results || [];
  const tvShows = popularSeries?.results || [];

  return (
    <div className="bg-[#050505] min-h-screen text-white overflow-x-hidden">
      <Header onSearch={setSearchQuery} logoUrl={logoUrl} />

      <main className="relative z-0">
        <AnimatePresence mode="wait">
          {searchQuery ? (
            <motion.div
              key="search-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pt-24 px-4 md:px-12 pb-24"
            >
              <h1 className="text-4xl font-bold mb-8">
                Search results for "{searchQuery}"
              </h1>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {searchResults?.results?.map((movie) => (
                  <div key={movie.id} className="relative group">
                    <a href={`/watch/${movie.id}`}>
                      <div className="aspect-[2/3] rounded-lg overflow-hidden border border-white/10 hover:border-[#e50914] transition-all">
                        <img
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
                          <h3 className="text-xs font-bold truncate">
                            {movie.title}
                          </h3>
                        </div>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
              {searchResults?.results?.length === 0 && (
                <div className="text-gray-500 py-20 text-center">
                  No movies found matching your search.
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="home-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Hero movies={featuredMovies} />

              <div className="relative -mt-12 md:-mt-40 z-10 space-y-2 pb-24">
                <MovieRow
                  title="Top 10 Movies Today"
                  movies={topTenMovies}
                  isTopTen={true}
                />
                <MovieRow
                  title="Popular Movies"
                  movies={popularMovies}
                  viewMoreLink="/category/popular"
                />
                <MovieRow
                  title="Hot K-Dramas"
                  movies={kdramas}
                  viewMoreLink="/category/kdrama"
                />
                <MovieRow
                  title="Trending Anime"
                  movies={animes}
                  viewMoreLink="/category/anime"
                />
                <MovieRow 
                  title="Upcoming Movies" 
                  movies={latestMovies} 
                  viewMoreLink="/category/movies"
                />
                <MovieRow 
                  title="Popular TV Shows" 
                  movies={tvShows} 
                  viewMoreLink="/category/tv"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-8 px-4 md:px-12 border-t border-white/10 text-gray-500 text-sm flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center gap-2">
          <span className="text-white font-black tracking-tighter italic">
            LK21 OFFICIAL
          </span>
          <span>© 2026 - Premium Movie Streaming</span>
        </div>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 md:gap-8">
          <a href="#" className="hover:text-white transition-colors">
            Terms of Use
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Contact Us
          </a>
          <a href="#" className="hover:text-white transition-colors">
            FAQ
          </a>
        </div>
      </footer>

      <style jsx global>{`
        body {
          background-color: #050505;
          margin: 0;
          font-family: 'Inter', sans-serif;
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #050505;
        }
        ::-webkit-scrollbar-thumb {
          background: #222;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #333;
        }
      `}</style>
    </div>
  );
}
