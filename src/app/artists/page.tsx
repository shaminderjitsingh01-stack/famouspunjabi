import { prisma } from "@/lib/prisma";
import { ArtistCard } from "@/components/artists/artist-card";
import Link from "next/link";
import { cn, formatArtistType } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Punjabi Artists",
  description: "Browse Punjabi actors, singers, directors, and comedians on FamousPunjabi.",
};

export const dynamic = "force-dynamic";

const artistTypes = [
  { value: "MULTI", label: "Actor/Singer" },
  { value: "ACTOR", label: "Actor" },
  { value: "SINGER", label: "Singer" },
  { value: "DIRECTOR", label: "Director" },
  { value: "COMEDIAN", label: "Comedian" },
];

const sorts = [
  { value: "name", label: "Name" },
  { value: "movies", label: "Most Movies" },
  { value: "songs", label: "Most Songs" },
];

export default async function ArtistsPage({
  searchParams,
}: {
  searchParams: { type?: string; sort?: string; page?: string };
}) {
  const type = searchParams.type;
  const sort = searchParams.sort || "name";
  const page = parseInt(searchParams.page || "1");
  const limit = 24;

  const where: any = {};
  if (type) where.type = type as any;

  const orderBy: any = sort === "movies"
    ? { totalMovies: "desc" }
    : sort === "songs"
    ? { totalSongs: "desc" }
    : { name: "asc" };

  const [artists, total] = await Promise.all([
    prisma.artist.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.artist.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-white">Punjabi Artists</h1>
      <p className="mt-1 text-gray-400">{total} artists in the database</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          {sorts.map((s) => (
            <Link
              key={s.value}
              href={`/artists?sort=${s.value}${type ? `&type=${type}` : ""}`}
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
            href={`/artists?sort=${sort}`}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              !type ? "bg-amber-500/20 text-amber-500" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            )}
          >
            All
          </Link>
          {artistTypes.map((t) => (
            <Link
              key={t.value}
              href={`/artists?type=${t.value}&sort=${sort}`}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                type === t.value ? "bg-amber-500/20 text-amber-500" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              )}
            >
              {t.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {artists.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>

      {artists.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-gray-500">No artists found.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/artists?page=${p}&sort=${sort}${type ? `&type=${type}` : ""}`}
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
