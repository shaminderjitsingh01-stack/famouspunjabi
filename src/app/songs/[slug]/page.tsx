import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { VideoEmbed } from "@/components/shared/video-embed";
import { SpotifyEmbed } from "@/components/shared/spotify-embed";
import { RatingDisplay } from "@/components/shared/rating-stars";
import { ShareButtons } from "@/components/shared/share-buttons";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/shared/section-header";
import { SongCard } from "@/components/songs/song-card";
import Link from "next/link";
import { Calendar, Music, Tag } from "lucide-react";
import { formatGenre } from "@/lib/utils";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const song = await prisma.song.findUnique({
    where: { slug: params.slug },
    select: { title: true, year: true, musicVideoYoutubeId: true },
  });
  if (!song) return { title: "Song Not Found" };
  return {
    title: `${song.title} (${song.year})`,
    description: `${song.title} — Punjabi song on FamousPunjabi. Watch the music video, listen on Spotify, and rate it.`,
    openGraph: {
      title: `${song.title} — FamousPunjabi`,
      images: song.musicVideoYoutubeId
        ? [`https://img.youtube.com/vi/${song.musicVideoYoutubeId}/maxresdefault.jpg`]
        : [],
    },
  };
}

export default async function SongPage({ params }: { params: { slug: string } }) {
  const song = await prisma.song.findUnique({
    where: { slug: params.slug },
    include: {
      credits: {
        include: { artist: true },
      },
      videos: { orderBy: { order: "asc" } },
      reviews: {
        where: { approved: true },
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!song) notFound();

  const singers = song.credits.filter(c => c.role === "SINGER" || c.role === "FEATURED");
  const lyricists = song.credits.filter(c => c.role === "LYRICIST");
  const musicDirectors = song.credits.filter(c => c.role === "MUSIC_DIRECTOR");

  // Related songs from same artist
  const mainArtistId = singers[0]?.artistId;
  const relatedSongs = mainArtistId
    ? await prisma.song.findMany({
        where: {
          id: { not: song.id },
          credits: { some: { artistId: mainArtistId, role: "SINGER" } },
        },
        take: 4,
        include: {
          credits: {
            include: { artist: { select: { name: true, slug: true } } },
            where: { role: "SINGER" },
          },
        },
        orderBy: { averageRating: "desc" },
      })
    : [];

  const creditRoleLabels: Record<string, string> = {
    SINGER: "Singer",
    FEATURED: "Featured",
    LYRICIST: "Lyricist",
    MUSIC_DIRECTOR: "Music",
    PRODUCER: "Producer",
    VIDEO_DIRECTOR: "Video Director",
  };

  return (
    <div className="pb-16">
      {/* Hero: Music Video */}
      {song.musicVideoYoutubeId && (
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <VideoEmbed
            youtubeId={song.musicVideoYoutubeId}
            title={song.title}
            lazy={true}
          />
        </div>
      )}

      {/* Song Info */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
          <div className="flex-1">
            <Badge>{formatGenre(song.genre)}</Badge>
            <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              {song.title}
            </h1>
            {song.titleGurmukhi && (
              <p className="mt-1 text-lg text-gray-500">{song.titleGurmukhi}</p>
            )}

            {/* Artists */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {singers.map((c) => (
                <Link
                  key={c.id}
                  href={`/artists/${c.artist.slug}`}
                  className="text-amber-500 hover:underline font-medium"
                >
                  {c.artist.name}
                </Link>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{song.year}</span>
              </div>
              {song.label && (
                <div className="flex items-center gap-1.5">
                  <Tag className="h-4 w-4" />
                  <span>{song.label}</span>
                </div>
              )}
              <RatingDisplay rating={song.averageRating} count={song.ratingCount} size="md" />
            </div>

            {/* Credits */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-white">Credits</h2>
              <div className="mt-3 space-y-2">
                {song.credits.map((c) => (
                  <div key={c.id} className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500 w-28">{creditRoleLabels[c.role] || c.role}</span>
                    <Link href={`/artists/${c.artist.slug}`} className="text-amber-500 hover:underline">
                      {c.artist.name}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Spotify */}
            {song.spotifyUrl && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-white mb-3">Listen on Spotify</h2>
                <SpotifyEmbed spotifyUrl={song.spotifyUrl} />
              </div>
            )}

            {/* More Videos */}
            {song.videos.length > 1 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-white">More Videos</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {song.videos.filter(v => v.youtubeId !== song.musicVideoYoutubeId).map((video) => (
                    <VideoEmbed key={video.id} youtubeId={video.youtubeId} title={video.title} lazy={true} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 space-y-6">
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Share</h3>
              <ShareButtons url={`/songs/${song.slug}`} title={song.title} />
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Details</h3>
              <div className="space-y-2 text-sm">
                {song.album && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Album</span>
                    <span className="text-gray-300">{song.album}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Genre</span>
                  <span className="text-gray-300">{formatGenre(song.genre)}</span>
                </div>
                {song.label && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Label</span>
                    <span className="text-gray-300">{song.label}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Year</span>
                  <span className="text-gray-300">{song.year}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Songs */}
      {relatedSongs.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 mt-16 sm:px-6 lg:px-8">
          <SectionHeader title={`More from ${singers[0]?.artist.name || 'Artist'}`} href={singers[0] ? `/artists/${singers[0].artist.slug}` : undefined} />
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedSongs.map((s) => (
              <SongCard key={s.id} song={s} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
