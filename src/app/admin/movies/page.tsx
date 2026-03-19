import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminMoviesPage() {
  const movies = await prisma.movie.findMany({
    orderBy: { year: "desc" },
    include: { genres: true, _count: { select: { ratings: true, reviews: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Movies ({movies.length})</h1>
        <Link href="/admin/movies/new" className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-400">
          <Plus className="h-4 w-4" /> Add Movie
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800 text-left text-xs text-gray-500">
              <th className="pb-3 pr-4">Title</th>
              <th className="pb-3 pr-4">Year</th>
              <th className="pb-3 pr-4">Genres</th>
              <th className="pb-3 pr-4">Rating</th>
              <th className="pb-3 pr-4">Reviews</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie) => (
              <tr key={movie.id} className="border-b border-gray-800/50 hover:bg-gray-900/50">
                <td className="py-3 pr-4">
                  <Link href={`/movies/${movie.slug}`} className="text-sm font-medium text-white hover:text-amber-500">{movie.title}</Link>
                </td>
                <td className="py-3 pr-4 text-sm text-gray-400">{movie.year}</td>
                <td className="py-3 pr-4 text-xs text-gray-500">{movie.genres.map(g => g.genre).join(", ")}</td>
                <td className="py-3 pr-4 text-sm text-gray-400">{movie.averageRating > 0 ? movie.averageRating.toFixed(1) : "\u2014"}</td>
                <td className="py-3 pr-4 text-sm text-gray-400">{movie._count.reviews}</td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/movies/${movie.id}/edit`} className="rounded p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white"><Pencil className="h-4 w-4" /></Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
