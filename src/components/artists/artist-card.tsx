import Link from "next/link";
import { CheckCircle, Film, Music } from "lucide-react";
import { cn, formatArtistType } from "@/lib/utils";

interface ArtistCardProps {
  artist: {
    slug: string;
    name: string;
    photoUrl: string | null;
    type: string;
    verified: boolean;
    totalMovies: number;
    totalSongs: number;
  };
  className?: string;
}

export function ArtistCard({ artist, className }: ArtistCardProps) {
  return (
    <Link href={`/artists/${artist.slug}`} className={cn("group block", className)}>
      <div className="relative overflow-hidden rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-700 transition-colors">
        {/* Photo */}
        <div className="aspect-square overflow-hidden">
          {artist.photoUrl ? (
            <img
              src={artist.photoUrl}
              alt={artist.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-800">
              <span className="text-4xl font-bold text-gray-700">{artist.name.charAt(0)}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-center gap-1.5">
            <h3 className="font-bold text-white group-hover:text-amber-500 transition-colors truncate">
              {artist.name}
            </h3>
            {artist.verified && (
              <CheckCircle className="h-4 w-4 text-amber-500 fill-amber-500 flex-shrink-0" />
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{formatArtistType(artist.type)}</p>
          <div className="mt-2 flex items-center gap-3">
            {artist.totalMovies > 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Film className="h-3 w-3" />
                <span>{artist.totalMovies} movies</span>
              </div>
            )}
            {artist.totalSongs > 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Music className="h-3 w-3" />
                <span>{artist.totalSongs} songs</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
