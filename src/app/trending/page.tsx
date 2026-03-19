import { prisma } from "@/lib/prisma";
import { MovieCard } from "@/components/movies/movie-card";
import { SongCard } from "@/components/songs/song-card";
import { ArtistCard } from "@/components/artists/artist-card";
import { SectionHeader } from "@/components/shared/section-header";
import { TrendingUp } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trending",
  description: "See what's trending in Punjabi entertainment — top movies, songs, and artists right now.",
};

export const dynamic = "force-dynamic";

export default async function TrendingPage() {
  const [trendingMovies, trendingSongs, trendingArtists] = await Promise.all([
    prisma.movie.findMany({
      where: { status: "RELEASED" },
      orderBy: [{ ratingCount: "desc" }, { averageRating: "desc" }],
      take: 8,
      include: { genres: true },
    }),
    prisma.song.findMany({
      orderBy: [{ ratingCount: "desc" }, { averageRating: "desc" }],
      take: 8,
      include: {
        credits: {
          include: { artist: { select: { name: true, slug: true } } },
          where: { role: "SINGER" },
        },
      },
    }),
    prisma.artist.findMany({
      orderBy: [{ totalMovies: "desc" }, { totalSongs: "desc" }],
      take: 12,
    }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <TrendingUp className="h-7 w-7 text-amber-500" />
        <h1 className="text-3xl font-bold text-white">Trending</h1>
      </div>
      <p className="mt-1 text-gray-400">What&apos;s hot in Punjabi entertainment right now</p>

      {/* Trending Movies */}
      <div className="mt-10">
        <SectionHeader title="Trending Movies" href="/movies?sort=rating" />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trendingMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>

      {/* Trending Songs */}
      <div className="mt-16">
        <SectionHeader title="Trending Songs" href="/songs?sort=rating" />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trendingSongs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      </div>

      {/* Trending Artists */}
      <div className="mt-16">
        <SectionHeader title="Popular Artists" href="/artists" />
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {trendingArtists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </div>
    </div>
  );
}
