import React, { useState } from "react";
import Header from "../../components/header";
import MovieRow from "../../components/movie-row";
import { useQuery } from "@tanstack/react-query";
import { Tv } from "lucide-react";

const fetchSeries = async (type) => {
  const response = await fetch(`/api/series?type=${type}`);
  if (!response.ok) throw new Error("Failed to fetch series");
  return response.json();
};

export default function SeriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const logoUrl =
    "https://raw.createusercontent.com/be84bc4b-495b-44a7-94a0-32ee6dc4938c/";

  const { data: popular } = useQuery({
    queryKey: ["series", "popular"],
    queryFn: () => fetchSeries("popular"),
  });

  const { data: trending } = useQuery({
    queryKey: ["series", "trending"],
    queryFn: () => fetchSeries("trending"),
  });

  const { data: latest } = useQuery({
    queryKey: ["series", "latest"],
    queryFn: () => fetchSeries("latest"),
  });

  return (
    <div className="bg-[#050505] min-h-screen text-white">
      <Header onSearch={setSearchQuery} logoUrl={logoUrl} />

      <main className="pt-24 pb-24">
        <div className="px-12 mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#e50914] flex items-center justify-center">
              <Tv size={24} />
            </div>
            <div>
              <h1 className="text-5xl font-black tracking-tight">TV Series</h1>
              <p className="text-gray-400 mt-1">
                Binge-watch your favorite series
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <MovieRow title="Popular Series" movies={popular?.results} />
          <MovieRow title="Trending Now" movies={trending?.results} />
          <MovieRow title="New Episodes" movies={latest?.results} />
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
