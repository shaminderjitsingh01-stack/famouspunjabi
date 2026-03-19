import Link from "next/link";
import { Star, Music } from "lucide-react";
import { cn, getYouTubeThumbnail, formatRating, formatGenre } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface SongCardProps {
  song: {
    slug: string;
    title: string;
    year: number;
    musicVideoYoutubeId: string | null;
    averageRating: number;
    ratingCount: number;
    genre: string;
    credits: { artist: { name: string; slug: string } }[];
  };
  className?: string;
}

export function SongCard({ song, className }: SongCardProps) {
  const thumbnail = song.musicVideoYoutubeId ? getYouTubeThumbnail(song.musicVideoYoutubeId, 'hq') : null;
  const mainArtist = song.credits[0]?.artist;

  return (
    <Link href={`/songs/${song.slug}`} className={cn("group block", className)}>
      <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-900">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={song.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <Music className="h-8 w-8 text-gray-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {song.averageRating > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 rounded-lg bg-black/70 px-2 py-1 backdrop-blur-sm">
            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold text-white">{formatRating(song.averageRating)}</span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-bold text-white group-hover:text-amber-500 transition-colors line-clamp-1">
            {song.title}
          </h3>
          <div className="mt-1 flex items-center gap-2">
            {mainArtist && <span className="text-xs text-gray-400">{mainArtist.name}</span>}
            <span className="text-xs text-gray-600">&bull;</span>
            <span className="text-xs text-gray-400">{song.year}</span>
            <Badge variant="secondary" className="text-[10px]">{formatGenre(song.genre)}</Badge>
          </div>
        </div>
      </div>
    </Link>
  );
}
