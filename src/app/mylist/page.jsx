import React, { useState } from "react";
import Header from "../../components/header";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, Trash2, Play } from "lucide-react";
import { motion } from "motion/react";

const fetchWatchlist = async () => {
  const response = await fetch("/api/watchlist");
  if (!response.ok) throw new Error("Failed to fetch watchlist");
  return response.json();
};

const removeFromWatchlist = async ({ itemId, type }) => {
  const response = await fetch(`/api/watchlist?itemId=${itemId}&type=${type}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to remove from watchlist");
  return response.json();
};

export default function MyListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const logoUrl =
    "https://raw.createusercontent.com/be84bc4b-495b-44a7-94a0-32ee6dc4938c/";
  const queryClient = useQueryClient();

  const { data: watchlist, isLoading } = useQuery({
    queryKey: ["watchlist"],
    queryFn: fetchWatchlist,
  });

  const removeMutation = useMutation({
    mutationFn: removeFromWatchlist,
    onSuccess: () => {
      queryClient.invalidateQueries(["watchlist"]);
    },
  });

  const handleRemove = (itemId, type) => {
    removeMutation.mutate({ itemId, type });
  };

  return (
    <div className="bg-[#050505] min-h-screen text-white">
      <Header onSearch={setSearchQuery} logoUrl={logoUrl} />

      <main className="pt-24 pb-24">
        <div className="px-12 mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#e50914] flex items-center justify-center">
              <Heart size={24} fill="white" />
            </div>
            <div>
              <h1 className="text-5xl font-black tracking-tight">My List</h1>
              <p className="text-gray-400 mt-1">
                {watchlist?.results?.length || 0} items saved
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="px-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="aspect-[2/3] bg-white/5 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : watchlist?.results?.length === 0 ? (
          <div className="px-12 py-20 text-center">
            <Heart
              size={64}
              className="mx-auto mb-4 text-gray-600"
              strokeWidth={1}
            />
            <h2 className="text-2xl font-bold text-gray-400 mb-2">
              Your list is empty
            </h2>
            <p className="text-gray-500">
              Start adding movies and series to your watchlist
            </p>
          </div>
        ) : (
          <div className="px-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {watchlist?.results?.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative group"
              >
                <div className="aspect-[2/3] rounded-lg overflow-hidden border border-white/10 hover:border-[#e50914] transition-all relative">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-sm font-bold mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <a
                          href={`/watch/${item.item_id}`}
                          className="flex-1 flex items-center justify-center gap-2 bg-[#e50914] hover:bg-[#b20710] text-white text-xs font-bold py-2 px-3 rounded transition-all"
                        >
                          <Play size={12} fill="white" />
                          Watch
                        </a>
                        <button
                          onClick={() => handleRemove(item.item_id, item.type)}
                          className="flex items-center justify-center bg-white/20 hover:bg-white/30 text-white p-2 rounded transition-all"
                          disabled={removeMutation.isPending}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Type Badge */}
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded uppercase">
                    {item.type}
                  </div>

                  {/* Rating */}
                  {item.vote_average && (
                    <div className="absolute top-2 right-2 bg-[#e50914]/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded">
                      ★ {item.vote_average.toFixed(1)}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
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
