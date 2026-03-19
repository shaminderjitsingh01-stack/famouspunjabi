import Link from "next/link";
import { Star } from "lucide-react";
import { cn, getYouTubeThumbnail, formatRating, formatGenre } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface MovieCardProps {
  movie: {
    slug: string;
    title: string;
    year: number;
    trailerYoutubeId: string | null;
    posterUrl: string | null;
    averageRating: number;
    ratingCount: number;
    genres: { genre: string }[];
  };
  className?: string;
}

export function MovieCard({ movie, className }: MovieCardProps) {
  const thumbnail = movie.posterUrl || (movie.trailerYoutubeId ? getYouTubeThumbnail(movie.trailerYoutubeId, 'hq') : null);

  return (
    <Link href={`/movies/${movie.slug}`} className={cn("group block", className)}>
      <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-900">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={movie.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <span className="text-gray-600 text-sm">No Image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Rating badge */}
        {movie.averageRating > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 rounded-lg bg-black/70 px-2 py-1 backdrop-blur-sm">
            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold text-white">{formatRating(movie.averageRating)}</span>
          </div>
        )}

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-bold text-white group-hover:text-amber-500 transition-colors line-clamp-1">
            {movie.title}
          </h3>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-xs text-gray-400">{movie.year}</span>
            {movie.genres.slice(0, 2).map((g) => (
              <Badge key={g.genre} variant="secondary" className="text-[10px]">
                {formatGenre(g.genre)}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
