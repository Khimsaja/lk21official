"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "../../../components/header";
import { ArrowLeft } from "lucide-react";

const getCategoryDetails = (type) => {
  switch (type) {
    case "kdrama":
      return { api: "/api/series?type=kdrama", title: "Korean Dramas" };
    case "anime":
      return { api: "/api/series?type=anime", title: "Anime Series" };
    case "tv":
      return { api: "/api/series?type=popular", title: "Popular TV Shows" };
    case "movies":
      return { api: "/api/movies?type=latest", title: "Upcoming Movies" };
    case "popular":
      return { api: "/api/movies?type=popular", title: "Popular Movies" };
    default:
      return { api: `/api/movies?type=popular`, title: "Explore" };
  }
};

const fetchCategory = async (api) => {
  const response = await fetch(api);
  if (!response.ok) throw new Error("Failed to fetch category");
  return response.json();
};

export default function CategoryPage({ params }) {
  const { type } = params;
  const [page, setPage] = useState(1);
  const { api, title } = getCategoryDetails(type);
  const logoUrl = "https://raw.createusercontent.com/be84bc4b-495b-44a7-94a0-32ee6dc4938c/";

  // Reset page when category changes
  useEffect(() => {
    setPage(1);
  }, [type]);

  const { data, isLoading } = useQuery({
    queryKey: ["category", type, page],
    queryFn: () => fetchCategory(`${api}&page=${page}`),
  });

  return (
    <div className="bg-[#050505] min-h-screen text-white overflow-x-hidden">
      <Header logoUrl={logoUrl} />

      <main className="pt-32 px-6 md:px-12 pb-24 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <a href="/" className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all text-gray-400 hover:text-white">
            <ArrowLeft size={24} />
          </a>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter flex items-center gap-4">
            {title}
            <span className="bg-[#e50914] text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-widest mt-1">
              FULL LIST
            </span>
          </h1>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-white/5 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {data?.results?.map((item) => (
              <div key={item.id} className="relative group">
                <a href={`/watch/${item.id}`}>
                  <div className="aspect-[2/3] rounded-lg overflow-hidden border border-white/10 group-hover:border-[#e50914] transition-all shadow-xl">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <h3 className="text-sm font-bold text-white line-clamp-2 leading-tight">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                         <span className="text-xs text-[#e50914] font-bold">★ {item.vote_average?.toFixed(1) || 'N/A'}</span>
                         <span className="text-[10px] text-gray-400">
                           {(item.release_date || item.first_air_date)?.split('-')[0]}
                         </span>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        )}

        {data?.results?.length === 0 && (
          <div className="text-gray-500 py-20 text-center text-xl font-bold">
            No content found in this category yet.
          </div>
        )}

        {/* Pagination Controls */}
        {!isLoading && data?.results?.length > 0 && (
          <div className="mt-16 flex justify-center items-center gap-6">
            <button 
              onClick={() => {
                setPage(p => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={page === 1}
              className="px-6 py-2.5 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg font-bold transition-colors shadow-lg"
            >
              Previous
            </button>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 font-medium">Page</span>
              <span className="text-white font-black text-xl">{page}</span>
            </div>
            <button 
              onClick={() => {
                setPage(p => p + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={data?.results?.length < 20}
              className="px-8 py-2.5 bg-[#e50914] hover:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg font-bold transition-colors shadow-lg shadow-red-500/20"
            >
              Next
            </button>
          </div>
        )}
      </main>

      <style jsx global>{`
        body {
          background-color: #050505;
        }
      `}</style>
    </div>
  );
}
