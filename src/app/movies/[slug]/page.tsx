import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { VideoEmbed } from "@/components/shared/video-embed";
import { RatingDisplay } from "@/components/shared/rating-stars";
import { ShareButtons } from "@/components/shared/share-buttons";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/shared/section-header";
import { MovieCard } from "@/components/movies/movie-card";
import Link from "next/link";
import { Clock, Calendar, Star, Film, ExternalLink } from "lucide-react";
import { formatGenre, formatCreditRole } from "@/lib/utils";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const movie = await prisma.movie.findUnique({
    where: { slug: params.slug },
    select: { title: true, year: true, synopsis: true, trailerYoutubeId: true },
  });
  if (!movie) return { title: "Movie Not Found" };

  return {
    title: `${movie.title} (${movie.year})`,
    description: movie.synopsis || `${movie.title} (${movie.year}) — Punjabi movie on FamousPunjabi`,
    openGraph: {
      title: `${movie.title} (${movie.year}) — FamousPunjabi`,
      description: movie.synopsis || `Watch ${movie.title} on FamousPunjabi`,
      images: movie.trailerYoutubeId
        ? [`https://img.youtube.com/vi/${movie.trailerYoutubeId}/maxresdefault.jpg`]
        : [],
    },
  };
}

export default async function MoviePage({ params }: { params: { slug: string } }) {
  const movie = await prisma.movie.findUnique({
    where: { slug: params.slug },
    include: {
      genres: true,
      credits: {
        include: { artist: true },
        orderBy: { order: "asc" },
      },
      videos: { orderBy: { order: "asc" } },
      streamingLinks: true,
      reviews: {
        where: { approved: true },
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!movie) notFound();

  // Fetch related movies (same genre, different movie)
  const relatedMovies = await prisma.movie.findMany({
    where: {
      id: { not: movie.id },
      status: "RELEASED",
      genres: movie.genres.length > 0 ? { some: { genre: movie.genres[0].genre } } : undefined,
    },
    take: 4,
    include: { genres: true },
    orderBy: { averageRating: "desc" },
  });

  const directors = movie.credits.filter(c => c.role === "DIRECTOR");
  const cast = movie.credits.filter(c => c.role === "LEAD_ACTOR" || c.role === "SUPPORTING_ACTOR");
  const otherCrew = movie.credits.filter(c => !["DIRECTOR", "LEAD_ACTOR", "SUPPORTING_ACTOR"].includes(c.role));

  const streamingPlatformNames: Record<string, string> = {
    NETFLIX: "Netflix",
    AMAZON_PRIME: "Amazon Prime",
    JIO_CINEMA: "JioCinema",
    ZEE5: "ZEE5",
    DISNEY_HOTSTAR: "Disney+ Hotstar",
    YOUTUBE_PREMIUM: "YouTube Premium",
    CHAUPAL: "Chaupal",
    APPLE_TV: "Apple TV+",
  };

  return (
    <div className="pb-16">
      {/* Hero: Trailer */}
      {movie.trailerYoutubeId && (
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <VideoEmbed
            youtubeId={movie.trailerYoutubeId}
            title={`${movie.title} — Official Trailer`}
            lazy={true}
          />
        </div>
      )}

      {/* Movie Info */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
          {/* Main content */}
          <div className="flex-1">
            {/* Title + Meta */}
            <div>
              <div className="flex flex-wrap items-center gap-3">
                {movie.genres.map((g) => (
                  <Badge key={g.genre}>{formatGenre(g.genre)}</Badge>
                ))}
              </div>
              <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                {movie.title}
              </h1>
              {movie.titleGurmukhi && (
                <p className="mt-1 text-lg text-gray-500">{movie.titleGurmukhi}</p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>{movie.year}</span>
                </div>
                {movie.runtime && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                  </div>
                )}
                <RatingDisplay
                  rating={movie.averageRating}
                  count={movie.ratingCount}
                  size="md"
                />
              </div>
            </div>

            {/* Synopsis */}
            {movie.synopsis && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-white">Synopsis</h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">{movie.synopsis}</p>
              </div>
            )}

            {/* Box Office */}
            {movie.boxOffice && (
              <div className="mt-4">
                <span className="text-sm text-gray-500">Box Office:</span>
                <span className="ml-2 text-sm font-semibold text-white">{movie.boxOffice}</span>
              </div>
            )}

            {/* Cast */}
            {cast.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-white">Cast</h2>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {cast.map((credit) => (
                    <Link
                      key={credit.id}
                      href={`/artists/${credit.artist.slug}`}
                      className="group flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-900 p-3 hover:border-gray-700 transition-colors"
                    >
                      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gray-800">
                        {credit.artist.photoUrl ? (
                          <img src={credit.artist.photoUrl} alt={credit.artist.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-sm font-bold text-gray-600">
                            {credit.artist.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate group-hover:text-amber-500 transition-colors">
                          {credit.artist.name}
                        </p>
                        <p className="text-xs text-gray-500">{formatCreditRole(credit.role)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Director + Crew */}
            {(directors.length > 0 || otherCrew.length > 0) && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-white">Crew</h2>
                <div className="mt-3 space-y-2">
                  {directors.map((d) => (
                    <div key={d.id} className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500 w-32">Director</span>
                      <Link href={`/artists/${d.artist.slug}`} className="text-amber-500 hover:underline">
                        {d.artist.name}
                      </Link>
                    </div>
                  ))}
                  {otherCrew.map((c) => (
                    <div key={c.id} className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500 w-32">{formatCreditRole(c.role)}</span>
                      <Link href={`/artists/${c.artist.slug}`} className="text-amber-500 hover:underline">
                        {c.artist.name}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* More Videos */}
            {movie.videos.length > 1 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-white">Videos</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {movie.videos.filter(v => v.youtubeId !== movie.trailerYoutubeId).map((video) => (
                    <VideoEmbed
                      key={video.id}
                      youtubeId={video.youtubeId}
                      title={video.title}
                      lazy={true}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 space-y-6">
            {/* Where to Watch */}
            {movie.streamingLinks.length > 0 && (
              <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
                <h3 className="text-sm font-semibold text-white">Where to Watch</h3>
                <div className="mt-3 space-y-2">
                  {movie.streamingLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-lg bg-gray-800 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                    >
                      <span>{streamingPlatformNames[link.platform] || link.platform}</span>
                      <ExternalLink className="h-3.5 w-3.5 text-gray-500" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Share */}
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Share</h3>
              <ShareButtons url={`/movies/${movie.slug}`} title={movie.title} />
            </div>

            {/* Quick Info */}
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Language</span>
                  <span className="text-gray-300">{movie.language.replace(/_/g, '-')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className="text-gray-300">{movie.status.charAt(0) + movie.status.slice(1).toLowerCase().replace(/_/g, ' ')}</span>
                </div>
                {movie.runtime && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Runtime</span>
                    <span className="text-gray-300">{movie.runtime} min</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Movies */}
      {relatedMovies.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 mt-16 sm:px-6 lg:px-8">
          <SectionHeader title="Related Movies" href="/movies" />
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedMovies.map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
