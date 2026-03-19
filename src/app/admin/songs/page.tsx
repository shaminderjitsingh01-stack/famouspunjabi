import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminSongsPage() {
  const songs = await prisma.song.findMany({
    orderBy: { year: "desc" },
    include: {
      credits: { include: { artist: { select: { name: true } } }, where: { role: "SINGER" }, take: 1 },
      _count: { select: { ratings: true } },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Songs ({songs.length})</h1>
        <Link href="/admin/songs/new" className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-400">
          <Plus className="h-4 w-4" /> Add Song
        </Link>
      </div>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800 text-left text-xs text-gray-500">
              <th className="pb-3 pr-4">Title</th>
              <th className="pb-3 pr-4">Artist</th>
              <th className="pb-3 pr-4">Year</th>
              <th className="pb-3 pr-4">Genre</th>
              <th className="pb-3 pr-4">Rating</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {songs.map((song) => (
              <tr key={song.id} className="border-b border-gray-800/50 hover:bg-gray-900/50">
                <td className="py-3 pr-4">
                  <Link href={`/songs/${song.slug}`} className="text-sm font-medium text-white hover:text-amber-500">{song.title}</Link>
                </td>
                <td className="py-3 pr-4 text-sm text-gray-400">{song.credits[0]?.artist.name || "\u2014"}</td>
                <td className="py-3 pr-4 text-sm text-gray-400">{song.year}</td>
                <td className="py-3 pr-4 text-xs text-gray-500">{song.genre}</td>
                <td className="py-3 pr-4 text-sm text-gray-400">{song.averageRating > 0 ? song.averageRating.toFixed(1) : "\u2014"}</td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/songs/${song.id}/edit`} className="rounded p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white"><Pencil className="h-4 w-4" /></Link>
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
