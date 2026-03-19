import { prisma } from "@/lib/prisma";
import { VideoEmbed } from "@/components/shared/video-embed";
import { MovieCard } from "@/components/movies/movie-card";
import { SongCard } from "@/components/songs/song-card";
import { ArtistCard } from "@/components/artists/artist-card";
import { SectionHeader } from "@/components/shared/section-header";
import { SearchBar } from "@/components/shared/search-bar";
import Link from "next/link";
import { Play, Film, Music, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredMovies, topMovies, topSongs, featuredArtists, recentMovies, recentSongs] = await Promise.all([
    // Featured movie for hero (pick one with a trailer)
    prisma.movie.findMany({
      where: { trailerYoutubeId: { not: null }, status: "RELEASED" },
      orderBy: { ratingCount: "desc" },
      take: 1,
      include: { genres: true, credits: { include: { artist: true }, where: { role: "LEAD_ACTOR" }, take: 2 } },
    }),
    // Top rated movies
    prisma.movie.findMany({
      where: { status: "RELEASED" },
      orderBy: [{ ratingCount: "desc" }, { averageRating: "desc" }],
      take: 8,
      include: { genres: true },
    }),
    // Top songs
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
    // Featured artists
    prisma.artist.findMany({
      where: { featured: true },
      orderBy: { totalMovies: "desc" },
      take: 6,
    }),
    // Recent movies
    prisma.movie.findMany({
      where: { status: "RELEASED" },
      orderBy: { year: "desc" },
      take: 4,
      include: { genres: true },
    }),
    // Recent songs
    prisma.song.findMany({
      orderBy: { year: "desc" },
      take: 4,
      include: {
        credits: {
          include: { artist: { select: { name: true, slug: true } } },
          where: { role: "SINGER" },
        },
      },
    }),
  ]);

  const heroMovie = featuredMovies[0];

  return (
    <div className="pb-16">
      {/* Hero Section */}
      {heroMovie && heroMovie.trailerYoutubeId && (
        <section className="relative">
          <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <VideoEmbed
                  youtubeId={heroMovie.trailerYoutubeId}
                  title={heroMovie.title}
                  lazy={true}
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-500">
                  Featured
                </span>
                <h1 className="mt-2 text-3xl font-bold text-white lg:text-4xl">
                  {heroMovie.title}
                </h1>
                <p className="mt-2 text-sm text-gray-400">
                  {heroMovie.year} • {heroMovie.genres.map(g => g.genre.charAt(0) + g.genre.slice(1).toLowerCase()).join(", ")}
                </p>
                {heroMovie.synopsis && (
                  <p className="mt-3 text-sm text-gray-400 line-clamp-4">
                    {heroMovie.synopsis}
                  </p>
                )}
                {heroMovie.credits.length > 0 && (
                  <p className="mt-3 text-sm text-gray-500">
                    Starring: {heroMovie.credits.map(c => c.artist.name).join(", ")}
                  </p>
                )}
                <Link
                  href={`/movies/${heroMovie.slug}`}
                  className="mt-4 inline-flex w-fit items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-black hover:bg-amber-400 transition-colors"
                >
                  <Play className="h-4 w-4 fill-black" />
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Stats Bar */}
      <section className="mt-12 border-y border-gray-800 bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center gap-2">
                <Film className="h-5 w-5 text-amber-500" />
                <span className="text-2xl font-bold text-white">{topMovies.length > 0 ? '40+' : '0'}</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">Punjabi Movies</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2">
                <Music className="h-5 w-5 text-amber-500" />
                <span className="text-2xl font-bold text-white">{topSongs.length > 0 ? '50+' : '0'}</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">Punjabi Songs</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2">
                <Users className="h-5 w-5 text-amber-500" />
                <span className="text-2xl font-bold text-white">{featuredArtists.length > 0 ? '33+' : '0'}</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">Artists</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Movies */}
      <section className="mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Trending Movies" href="/movies" />
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {topMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Songs */}
      <section className="mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Popular Songs" href="/songs" />
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {topSongs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Artists */}
      <section className="mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Featured Artists" href="/artists" />
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {featuredArtists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </div>
      </section>

      {/* Recently Added */}
      <section className="mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Recently Added Movies" href="/movies?sort=newest" />
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recentMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Latest Songs" href="/songs?sort=newest" />
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recentSongs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </div>
      </section>

      {/* Search CTA */}
      <section className="mt-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Find your favorite Punjabi entertainment
          </h2>
          <p className="mt-2 text-gray-400">
            Search across movies, songs, and artists
          </p>
          <div className="mt-6">
            <SearchBar size="lg" />
          </div>
        </div>
      </section>
    </div>
  );
}
