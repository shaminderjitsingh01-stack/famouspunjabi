import { prisma } from "@/lib/prisma";
import { MovieCard } from "@/components/movies/movie-card";
import Link from "next/link";
import { cn, formatGenre } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Punjabi Movies",
  description: "Browse the complete database of Punjabi movies. Find Pollywood films by year, genre, and rating.",
};

export const dynamic = "force-dynamic";

const genres = ["COMEDY", "ROMANCE", "ACTION", "DRAMA", "THRILLER", "FAMILY", "DEVOTIONAL", "HISTORICAL", "BIOGRAPHICAL", "MUSICAL"];
const years = Array.from({ length: 15 }, (_, i) => 2024 - i);
const sorts = [
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Top Rated" },
  { value: "year", label: "By Year" },
];

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: { genre?: string; year?: string; sort?: string; page?: string };
}) {
  const genre = searchParams.genre;
  const year = searchParams.year;
  const sort = searchParams.sort || "newest";
  const page = parseInt(searchParams.page || "1");
  const limit = 20;

  const where: any = { status: "RELEASED" };
  if (genre) where.genres = { some: { genre: genre as any } };
  if (year) where.year = parseInt(year);

  const orderBy: any = sort === "rating"
    ? { averageRating: "desc" }
    : sort === "year"
    ? { year: "desc" }
    : { createdAt: "desc" };

  const [movies, total] = await Promise.all([
    prisma.movie.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: { genres: true },
    }),
    prisma.movie.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-white">Punjabi Movies</h1>
      <p className="mt-1 text-gray-400">{total} movies in the database</p>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap gap-3">
        {/* Sort */}
        <div className="flex items-center gap-2">
          {sorts.map((s) => (
            <Link
              key={s.value}
              href={`/movies?sort=${s.value}${genre ? `&genre=${genre}` : ""}${year ? `&year=${year}` : ""}`}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                sort === s.value
                  ? "bg-amber-500 text-black"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              )}
            >
              {s.label}
            </Link>
          ))}
        </div>

        <div className="h-6 w-px bg-gray-800" />

        {/* Genre filter */}
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/movies?sort=${sort}${year ? `&year=${year}` : ""}`}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              !genre ? "bg-amber-500/20 text-amber-500" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            )}
          >
            All
          </Link>
          {genres.map((g) => (
            <Link
              key={g}
              href={`/movies?genre=${g}&sort=${sort}${year ? `&year=${year}` : ""}`}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                genre === g
                  ? "bg-amber-500/20 text-amber-500"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              )}
            >
              {formatGenre(g)}
            </Link>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {movies.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-gray-500">No movies found matching your filters.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/movies?page=${p}&sort=${sort}${genre ? `&genre=${genre}` : ""}${year ? `&year=${year}` : ""}`}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                p === page
                  ? "bg-amber-500 text-black"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              )}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
