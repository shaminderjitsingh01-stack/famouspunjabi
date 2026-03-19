import { prisma } from "@/lib/prisma";
import { SongCard } from "@/components/songs/song-card";
import Link from "next/link";
import { cn, formatGenre } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Punjabi Songs",
  description: "Browse Punjabi songs. Find the latest and greatest Punjabi music, from Bhangra to Hip-Hop.",
};

export const dynamic = "force-dynamic";

const songGenres = ["POP", "HIPHOP", "FOLK", "BHANGRA", "SAD", "ROMANTIC", "DEVOTIONAL", "PARTY", "RAP", "SUFI"];
const sorts = [
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Top Rated" },
  { value: "year", label: "By Year" },
];

export default async function SongsPage({
  searchParams,
}: {
  searchParams: { genre?: string; sort?: string; page?: string };
}) {
  const genre = searchParams.genre;
  const sort = searchParams.sort || "newest";
  const page = parseInt(searchParams.page || "1");
  const limit = 20;

  const where: any = {};
  if (genre) where.genre = genre as any;

  const orderBy: any = sort === "rating"
    ? { averageRating: "desc" }
    : sort === "year"
    ? { year: "desc" }
    : { createdAt: "desc" };

  const [songs, total] = await Promise.all([
    prisma.song.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        credits: {
          include: { artist: { select: { name: true, slug: true } } },
          where: { role: "SINGER" },
        },
      },
    }),
    prisma.song.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-white">Punjabi Songs</h1>
      <p className="mt-1 text-gray-400">{total} songs in the database</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          {sorts.map((s) => (
            <Link
              key={s.value}
              href={`/songs?sort=${s.value}${genre ? `&genre=${genre}` : ""}`}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                sort === s.value ? "bg-amber-500 text-black" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              )}
            >
              {s.label}
            </Link>
          ))}
        </div>
        <div className="h-6 w-px bg-gray-800" />
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/songs?sort=${sort}`}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              !genre ? "bg-amber-500/20 text-amber-500" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            )}
          >
            All
          </Link>
          {songGenres.map((g) => (
            <Link
              key={g}
              href={`/songs?genre=${g}&sort=${sort}`}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                genre === g ? "bg-amber-500/20 text-amber-500" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              )}
            >
              {formatGenre(g)}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {songs.map((song) => (
          <SongCard key={song.id} song={song} />
        ))}
      </div>

      {songs.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-gray-500">No songs found matching your filters.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/songs?page=${p}&sort=${sort}${genre ? `&genre=${genre}` : ""}`}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                p === page ? "bg-amber-500 text-black" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
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
