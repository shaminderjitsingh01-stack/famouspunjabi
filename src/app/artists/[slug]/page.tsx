import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { VideoEmbed } from "@/components/shared/video-embed";
import { RatingDisplay } from "@/components/shared/rating-stars";
import { ShareButtons } from "@/components/shared/share-buttons";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { CheckCircle, Calendar, MapPin, Film, Music, ExternalLink, Youtube, Instagram } from "lucide-react";
import { formatArtistType, formatCreditRole, formatGenre, formatFollowers, formatRating, getYouTubeThumbnail } from "@/lib/utils";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const artist = await prisma.artist.findUnique({
    where: { slug: params.slug },
    select: { name: true, bio: true, photoUrl: true, type: true },
  });
  if (!artist) return { title: "Artist Not Found" };
  return {
    title: `${artist.name} — ${formatArtistType(artist.type)}`,
    description: artist.bio || `${artist.name} — Punjabi ${formatArtistType(artist.type).toLowerCase()} on FamousPunjabi`,
    openGraph: {
      title: `${artist.name} — FamousPunjabi`,
      description: artist.bio || undefined,
      images: artist.photoUrl ? [artist.photoUrl] : [],
    },
  };
}

export default async function ArtistPage({ params }: { params: { slug: string } }) {
  const artist = await prisma.artist.findUnique({
    where: { slug: params.slug },
    include: {
      socialAccounts: true,
      movieCredits: {
        include: {
          movie: { include: { genres: true } },
        },
        orderBy: { movie: { year: "desc" } },
      },
      songCredits: {
        include: {
          song: {
            include: {
              credits: {
                include: { artist: { select: { name: true, slug: true } } },
                where: { role: "SINGER" },
              },
            },
          },
        },
        orderBy: { song: { year: "desc" } },
      },
      videos: { orderBy: { order: "asc" }, take: 4 },
    },
  });

  if (!artist) notFound();

  const socialIcons: Record<string, any> = {
    YOUTUBE: Youtube,
    INSTAGRAM: Instagram,
  };

  // Deduplicate movies (artist may have multiple roles in same movie)
  const uniqueMovies = new Map();
  artist.movieCredits.forEach(credit => {
    if (!uniqueMovies.has(credit.movieId)) {
      uniqueMovies.set(credit.movieId, { movie: credit.movie, roles: [credit.role] });
    } else {
      uniqueMovies.get(credit.movieId).roles.push(credit.role);
    }
  });

  return (
    <div className="pb-16">
      {/* Hero section */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:gap-8">
          {/* Photo */}
          <div className="flex-shrink-0">
            <div className="h-48 w-48 overflow-hidden rounded-2xl bg-gray-800 md:h-64 md:w-64">
              {artist.photoUrl ? (
                <img src={artist.photoUrl} alt={artist.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-6xl font-bold text-gray-700">{artist.name.charAt(0)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <Badge>{formatArtistType(artist.type)}</Badge>
            <div className="mt-2 flex items-center gap-2">
              <h1 className="text-3xl font-bold text-white sm:text-4xl">{artist.name}</h1>
              {artist.verified && <CheckCircle className="h-6 w-6 text-amber-500 fill-amber-500" />}
            </div>
            {artist.nameGurmukhi && (
              <p className="mt-1 text-lg text-gray-500">{artist.nameGurmukhi}</p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-400">
              {artist.birthPlace && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  <span>{artist.birthPlace}</span>
                </div>
              )}
              {artist.birthDate && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>Born {new Date(artist.birthDate).getFullYear()}</span>
                </div>
              )}
              {artist.deathDate && (
                <span className="text-gray-600">
                  — Died {new Date(artist.deathDate).getFullYear()}
                </span>
              )}
            </div>

            {/* Stats */}
            <div className="mt-4 flex gap-6">
              {artist.totalMovies > 0 && (
                <div className="flex items-center gap-2">
                  <Film className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="text-lg font-bold text-white">{artist.totalMovies}</p>
                    <p className="text-xs text-gray-500">Movies</p>
                  </div>
                </div>
              )}
              {artist.totalSongs > 0 && (
                <div className="flex items-center gap-2">
                  <Music className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="text-lg font-bold text-white">{artist.totalSongs}</p>
                    <p className="text-xs text-gray-500">Songs</p>
                  </div>
                </div>
              )}
            </div>

            {/* Social Links */}
            {artist.socialAccounts.length > 0 && (
              <div className="mt-4 flex gap-3">
                {artist.socialAccounts.map((social) => {
                  const Icon = socialIcons[social.platform] || ExternalLink;
                  return (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg bg-gray-800 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{social.followers ? formatFollowers(social.followers) : social.platform}</span>
                    </a>
                  );
                })}
              </div>
            )}

            {artist.bio && (
              <p className="mt-4 text-sm leading-relaxed text-gray-400">{artist.bio}</p>
            )}

            <div className="mt-4">
              <ShareButtons url={`/artists/${artist.slug}`} title={artist.name} />
            </div>
          </div>
        </div>
      </div>

      {/* Filmography */}
      {uniqueMovies.size > 0 && (
        <div className="mx-auto max-w-7xl px-4 mt-12 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-white">Filmography</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 text-left text-xs text-gray-500">
                  <th className="pb-3 pr-4">Year</th>
                  <th className="pb-3 pr-4">Movie</th>
                  <th className="pb-3 pr-4">Role</th>
                  <th className="pb-3">Rating</th>
                </tr>
              </thead>
              <tbody>
                {Array.from(uniqueMovies.values()).map(({ movie, roles }) => (
                  <tr key={movie.id} className="border-b border-gray-800/50 hover:bg-gray-900/50">
                    <td className="py-3 pr-4 text-sm text-gray-500">{movie.year}</td>
                    <td className="py-3 pr-4">
                      <Link href={`/movies/${movie.slug}`} className="text-sm font-medium text-white hover:text-amber-500 transition-colors">
                        {movie.title}
                      </Link>
                      <div className="flex gap-1 mt-0.5">
                        {movie.genres.slice(0, 2).map((g: any) => (
                          <span key={g.genre} className="text-[10px] text-gray-600">{formatGenre(g.genre)}</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-xs text-gray-400">
                      {roles.map((r: string) => formatCreditRole(r)).join(", ")}
                    </td>
                    <td className="py-3">
                      <RatingDisplay rating={movie.averageRating} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Discography */}
      {artist.songCredits.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 mt-12 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-white">Discography</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 text-left text-xs text-gray-500">
                  <th className="pb-3 pr-4">Year</th>
                  <th className="pb-3 pr-4">Song</th>
                  <th className="pb-3 pr-4">Role</th>
                  <th className="pb-3">Rating</th>
                </tr>
              </thead>
              <tbody>
                {artist.songCredits.map((credit) => (
                  <tr key={credit.id} className="border-b border-gray-800/50 hover:bg-gray-900/50">
                    <td className="py-3 pr-4 text-sm text-gray-500">{credit.song.year}</td>
                    <td className="py-3 pr-4">
                      <Link href={`/songs/${credit.song.slug}`} className="text-sm font-medium text-white hover:text-amber-500 transition-colors">
                        {credit.song.title}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 text-xs text-gray-400">{formatCreditRole(credit.role)}</td>
                    <td className="py-3">
                      <RatingDisplay rating={credit.song.averageRating} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Videos */}
      {artist.videos.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 mt-12 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-white">Videos</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {artist.videos.map((video) => (
              <VideoEmbed key={video.id} youtubeId={video.youtubeId} title={video.title} lazy={true} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
