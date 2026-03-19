"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { MovieCard } from "@/components/movies/movie-card";
import { SongCard } from "@/components/songs/song-card";
import { ArtistCard } from "@/components/artists/artist-card";
import { Search, Film, Music, Users } from "lucide-react";

export default function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any>({ movies: [], songs: [], artists: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults({ movies: [], songs: [], artists: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
      } catch (e) {
        console.error("Search error:", e);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const totalResults = results.movies.length + results.songs.length + results.artists.length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-white">Search</h1>
      <p className="mt-1 text-gray-400">Find movies, songs, and artists</p>

      <div className="mt-6 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, songs, artists..."
            autoFocus
            className="w-full rounded-xl border border-gray-800 bg-gray-900 py-4 pl-12 pr-4 text-lg text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      {loading && (
        <div className="mt-8 text-gray-500">Searching...</div>
      )}

      {!loading && query.length >= 2 && totalResults === 0 && (
        <div className="mt-16 text-center">
          <Search className="mx-auto h-12 w-12 text-gray-700" />
          <p className="mt-4 text-gray-500">No results found for &ldquo;{query}&rdquo;</p>
        </div>
      )}

      {/* Movies */}
      {results.movies.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <Film className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-white">Movies</h2>
            <span className="text-sm text-gray-500">({results.movies.length})</span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {results.movies.map((movie: any) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      )}

      {/* Songs */}
      {results.songs.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <Music className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-white">Songs</h2>
            <span className="text-sm text-gray-500">({results.songs.length})</span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {results.songs.map((song: any) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </div>
      )}

      {/* Artists */}
      {results.artists.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-white">Artists</h2>
            <span className="text-sm text-gray-500">({results.artists.length})</span>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {results.artists.map((artist: any) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </div>
      )}

      {/* Initial state */}
      {!loading && query.length < 2 && (
        <div className="mt-16 text-center">
          <Search className="mx-auto h-12 w-12 text-gray-700" />
          <p className="mt-4 text-gray-500">Start typing to search</p>
        </div>
      )}
    </div>
  );
}
