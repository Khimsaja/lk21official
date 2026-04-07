import React, { useState } from "react";
import Header from "../../../components/header";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Play,
  Star,
  Calendar,
  Clock,
  Share2,
  Plus,
  Check,
  ThumbsUp,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const fetchMovieDetail = async (id) => {
  // Try movies first
  const movieResponse = await fetch(`/api/movies?type=detail&id=${id}`);
  if (movieResponse.ok) {
    const data = await movieResponse.json();
    return { ...data, contentType: "movie" };
  }

  // If not found, try series
  const seriesResponse = await fetch(`/api/series?type=detail&id=${id}`);
  if (seriesResponse.ok) {
    const data = await seriesResponse.json();
    return { ...data, contentType: "series" };
  }

  throw new Error("Content not found");
};

const addToWatchlist = async ({ itemId, type }) => {
  const response = await fetch("/api/watchlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemId, type }),
  });
  if (!response.ok) throw new Error("Failed to add to watchlist");
  return response.json();
};

const checkInWatchlist = async (movieId) => {
  const response = await fetch("/api/watchlist");
  if (!response.ok) return false;
  const data = await response.json();
  return data.results.some(
    (item) => item.item_id === parseInt(movieId) && item.type === "movie",
  );
};

export default function WatchPage({ params }) {
  const { id } = params;
  const logoUrl =
    "https://raw.createusercontent.com/be84bc4b-495b-44a7-94a0-32ee6dc4938c/";
  const [selectedServer, setSelectedServer] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const queryClient = useQueryClient();

  const { data: movie, isLoading } = useQuery({
    queryKey: ["content", "detail", id],
    queryFn: () => fetchMovieDetail(id),
  });

  const { data: inWatchlist } = useQuery({
    queryKey: ["watchlist", "check", id],
    queryFn: () => checkInWatchlist(id),
    enabled: !!movie,
  });

  const addMutation = useMutation({
    mutationFn: addToWatchlist,
    onSuccess: () => {
      queryClient.invalidateQueries(["watchlist"]);
      queryClient.invalidateQueries(["watchlist", "check", id]);
      toast.success("Added to My List!");
    },
    onError: () => {
      toast.error("Failed to add to My List");
    },
  });

  const handleAddToList = () => {
    if (inWatchlist) {
      toast.info("Already in your list!");
      return;
    }
    addMutation.mutate({
      itemId: parseInt(id),
      type: movie?.contentType || "movie",
    });
  };

  if (isLoading)
    return (
      <div className="bg-[#050505] min-h-screen flex items-center justify-center text-white text-2xl font-black italic">
        LOADING...
      </div>
    );
  if (!movie)
    return (
      <div className="bg-[#050505] min-h-screen flex items-center justify-center text-white">
        Content not found.
      </div>
    );

  const isSeries = movie.contentType === "series";
  const mediaType = isSeries ? "tv" : "movie";

  // Multi-server dengan subtitle Indonesia (Updated based on user's premium list)
  // Massive Multi-server List based on the screenshot provided
  const servers = [
    {
      name: "RiveEmbed",
      url: isSeries ? `https://rivestream.org/embed?type=tv&id=${id}&season=${season}&ep=${episode}` : `https://rivestream.org/embed?type=movie&id=${id}`,
      quality: "HD",
      subtitle: "SUB INDO",
    },
    {
      name: "111Movies",
      url: isSeries ? `https://111movies.net/tv/${id}/${season}/${episode}` : `https://111movies.net/movie/${id}`,
      quality: "HD 1080P",
      subtitle: "Ads Free",
    },
    {
      name: "VidLink",
      url: isSeries ? `https://vidlink.pro/tv/${id}/${season}/${episode}` : `https://vidlink.pro/movie/${id}`,
      quality: "HD 1080P",
      subtitle: "Ads Free",
    },
    {
      name: "Vidsrc.wtf (API 1)",
      url: isSeries ? `https://vidsrc.xyz/embed/tv?tmdb=${id}&season=${season}&ep=${episode}` : `https://vidsrc.xyz/embed/movie?tmdb=${id}`,
      quality: "HD",
      subtitle: "MULTI SUB",
    },
    {
      name: "Videasy",
      url: isSeries ? `https://player.videasy.net/tv/${id}/${season}/${episode}` : `https://player.videasy.net/movie/${id}`,
      quality: "HD",
      subtitle: "MULTI SUB",
    },
    {
      name: "SmashyStream",
      url: isSeries ? `https://player.smashy.stream/tv?tmdb=${id}&s=${season}&e=${episode}` : `https://player.smashy.stream/movie?tmdb=${id}`,
      quality: "HD 1080P",
      subtitle: "MULTI SUB",
    },
    {
      name: "AutoEmbed",
      url: isSeries ? `https://tom.autoembed.cc/tv/${id}/${season}/${episode}` : `https://tom.autoembed.cc/movie/${id}`,
      quality: "HD",
      subtitle: "MULTI SUB",
    },
    {
      name: "VidFast",
      url: isSeries ? `https://vidfast.pro/embed/tv/${id}/${season}/${episode}` : `https://vidfast.pro/embed/movie/${id}`,
      quality: "HD 720P",
      subtitle: "FAST LAZY",
    },
    {
      name: "2Embed",
      url: isSeries ? `https://www.2embed.cc/embedtv/${id}&s=${season}&e=${episode}` : `https://www.2embed.cc/embed/${id}`,
      quality: "HD",
      subtitle: "MULTI SUB",
    },
    {
      name: "MoviesAPI",
      url: isSeries ? `https://moviesapi.club/tv/${id}-${season}-${episode}` : `https://moviesapi.club/movie/${id}`,
      quality: "HD",
      subtitle: "MULTI SUB",
    },
    {
      name: "MultiEmbed",
      url: isSeries ? `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${season}&e=${episode}` : `https://multiembed.mov/?video_id=${id}&tmdb=1`,
      quality: "HD 1080P",
      subtitle: "MULTI SUB",
    },
    {
      name: "VidSrc.me",
      url: isSeries ? `https://vidsrc.me/embed/tv?tmdb=${id}&season=${season}&ep=${episode}` : `https://vidsrc.me/embed/movie?tmdb=${id}`,
      quality: "HD",
      subtitle: "ENG/INDO",
    },
    {
      name: "WarezCDN",
      url: isSeries ? `https://embed.warezcdn.link/serie/${id}/${season}/${episode}` : `https://embed.warezcdn.link/filme/${id}`,
      quality: "CAM/HD",
      subtitle: "Fast Stream",
    },
    {
      name: "SuperFlix",
      url: isSeries ? `https://superflixapi.top/tv/${id}/${season}/${episode}` : `https://superflixapi.top/movie/${id}`,
      quality: "HD",
      subtitle: "MULTI SUB",
    },
  ];

  const currentServer = servers[selectedServer];
  const backdropUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
  const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  const rating = Number(movie.vote_average)?.toFixed(1) || "N/A";
  const year =
    (movie.release_date || movie.first_air_date)?.split("-")[0] || "N/A";
  const runtime = isSeries
    ? `${movie.number_of_seasons} Season${movie.number_of_seasons > 1 ? "s" : ""} • ${movie.number_of_episodes} Episodes`
    : movie.runtime
      ? `${movie.runtime}m`
      : "N/A";

  return (
    <div className="bg-[#050505] min-h-screen text-white">
      <Header
        logoUrl={logoUrl}
        onSearch={() => toast.info("Go to Home to search")}
      />

      <main className="pt-20 px-4 md:px-12 pb-24">
        {/* Player Section */}
        <div className="relative aspect-video w-full max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-white/5 bg-black mt-8">

          <iframe
            key={`${selectedServer}-${season}-${episode}`}
            src={currentServer.url}
            className="w-full h-full border-none"
            allowFullScreen
          />
        </div>

        {/* Server Selector */}
        <div className="max-w-6xl mx-auto mt-6">
          <div className="bg-white/5 p-5 rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-300 text-sm font-bold uppercase tracking-widest">
                Pilih Server Streaming
              </span>
              <div className="text-xs text-gray-500">
                Semua server support subtitle Indonesia
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              {servers.map((server, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedServer(index);
                    toast.success(`Switched to ${server.name}`);
                  }}
                  className={`p-4 rounded-lg text-sm font-bold transition-all border ${
                    selectedServer === index
                      ? "bg-[#e50914] border-[#e50914] text-white shadow-lg scale-105"
                      : "bg-black/40 border-white/10 text-gray-400 hover:border-white/20 hover:bg-black/60"
                  }`}
                >
                  <div className="mb-2">{server.name}</div>
                  <div className="flex items-center justify-between text-xs opacity-80">
                    <span className="bg-white/10 px-2 py-0.5 rounded">
                      {server.subtitle}
                    </span>
                    <span>{server.quality}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Season and Episode Selector for TV Series */}
        {isSeries && (
          <div className="max-w-6xl mx-auto mt-6">
            <div className="bg-white/5 p-6 rounded-xl border border-[#e50914]/20 flex flex-col md:flex-row items-center gap-6 shadow-xl">
              <div className="flex-1 flex items-center justify-between bg-black/40 px-6 py-3 rounded-lg border border-white/10 w-full">
                <span className="text-gray-400 font-bold tracking-widest text-sm">SEASON</span>
                <select 
                  value={season}
                  onChange={(e) => {
                    setSeason(parseInt(e.target.value));
                    setEpisode(1); // reset episode when changing season
                  }}
                  className="bg-transparent text-white font-black text-xl outline-none text-right cursor-pointer"
                >
                  {Array.from({ length: movie.number_of_seasons || 1 }).map((_, i) => (
                    <option key={i + 1} value={i + 1} className="bg-black">Season {i + 1}</option>
                  ))}
                </select>
              </div>

              <div className="flex-1 flex items-center justify-between bg-black/40 px-6 py-3 rounded-lg border border-white/10 w-full">
                <span className="text-gray-400 font-bold tracking-widest text-sm">EPISODE</span>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setEpisode(Math.max(1, episode - 1))}
                    disabled={episode <= 1}
                    className="p-1 rounded-full hover:bg-white/10 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronDown size={24} className="rotate-90" />
                  </button>
                  <span className="text-white font-black text-2xl w-8 text-center">{episode}</span>
                  <button 
                    onClick={() => setEpisode(episode + 1)}
                    className="p-1 rounded-full hover:bg-white/10 text-[#e50914]"
                  >
                    <ChevronDown size={24} className="-rotate-90" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Movie Info Section */}
        <div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Main Info */}
          <div className="md:col-span-3">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center gap-1 text-[#e50914]">
                <Star size={18} fill="#e50914" stroke="none" />
                <span className="text-xl font-bold">{rating}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Calendar size={14} />
                <span>{year}</span>
                <span className="mx-1">•</span>
                <Clock size={14} />
                <span>{runtime}</span>
                <span className="mx-1">•</span>
                <span className="border border-gray-600 px-2 rounded-sm text-[10px]">
                  HD
                </span>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">
              {movie.title}
            </h1>

            <div className="flex flex-wrap gap-2 mb-8">
              {movie.genres?.map((g) => (
                <span
                  key={g.id}
                  className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs font-medium text-gray-300"
                >
                  {g.name}
                </span>
              ))}
            </div>

            <div className="relative">
              <p
                className={`text-gray-400 text-lg leading-relaxed ${!isExpanded ? "line-clamp-3" : ""}`}
              >
                {movie.overview}
              </p>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-[#e50914] font-bold text-sm mt-2 flex items-center gap-1 hover:underline"
              >
                {isExpanded ? "Show less" : "Read more"}{" "}
                <ChevronDown
                  size={14}
                  className={isExpanded ? "rotate-180" : ""}
                />
              </button>
            </div>

            <div className="flex items-center gap-6 mt-12">
              <button
                onClick={handleAddToList}
                disabled={inWatchlist || addMutation.isPending}
                className={`flex flex-col items-center gap-2 transition-all ${
                  inWatchlist
                    ? "text-[#e50914]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <div
                  className={`p-3 rounded-full border ${
                    inWatchlist
                      ? "bg-[#e50914]/20 border-[#e50914]"
                      : "bg-white/5 border-white/10"
                  }`}
                >
                  {inWatchlist ? <Check size={20} /> : <Plus size={20} />}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  {inWatchlist ? "In My List" : "My List"}
                </span>
              </button>
              <button className="flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-all">
                <div className="p-3 bg-white/5 rounded-full border border-white/10">
                  <ThumbsUp size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Rate
                </span>
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied to clipboard!");
                }}
                className="flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-all"
              >
                <div className="p-3 bg-white/5 rounded-full border border-white/10">
                  <Share2 size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Share
                </span>
              </button>
            </div>
          </div>

          {/* Sidebar / More Info */}
          <div className="space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4 italic">
                Recommended
              </h3>
              <div className="space-y-4">
                {movie.recommendations?.results?.slice(0, 4).map((rec) => (
                  <a
                    key={rec.id}
                    href={`/watch/${rec.id}`}
                    className="flex gap-3 group"
                  >
                    <div className="w-16 aspect-[2/3] rounded-lg overflow-hidden shrink-0 border border-white/10 group-hover:border-[#e50914] transition-all">
                      <img
                        src={`https://image.tmdb.org/t/p/w200${rec.poster_path}`}
                        alt={rec.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="text-xs font-bold line-clamp-2 group-hover:text-[#e50914] transition-colors">
                        {rec.title}
                      </h4>
                      <span className="text-[10px] text-gray-500 mt-1">
                        {rec.release_date?.split("-")[0]}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        body {
          background-color: #050505;
        }
      `}</style>
    </div>
  );
}
