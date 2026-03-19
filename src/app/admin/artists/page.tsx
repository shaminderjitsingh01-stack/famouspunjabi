import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { formatArtistType } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminArtistsPage() {
  const artists = await prisma.artist.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { movieCredits: true, songCredits: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Artists ({artists.length})</h1>
        <Link href="/admin/artists/new" className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-400">
          <Plus className="h-4 w-4" /> Add Artist
        </Link>
      </div>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800 text-left text-xs text-gray-500">
              <th className="pb-3 pr-4">Name</th>
              <th className="pb-3 pr-4">Type</th>
              <th className="pb-3 pr-4">Movies</th>
              <th className="pb-3 pr-4">Songs</th>
              <th className="pb-3 pr-4">Verified</th>
              <th className="pb-3 pr-4">Featured</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {artists.map((artist) => (
              <tr key={artist.id} className="border-b border-gray-800/50 hover:bg-gray-900/50">
                <td className="py-3 pr-4">
                  <Link href={`/artists/${artist.slug}`} className="text-sm font-medium text-white hover:text-amber-500">{artist.name}</Link>
                </td>
                <td className="py-3 pr-4 text-sm text-gray-400">{formatArtistType(artist.type)}</td>
                <td className="py-3 pr-4 text-sm text-gray-400">{artist._count.movieCredits}</td>
                <td className="py-3 pr-4 text-sm text-gray-400">{artist._count.songCredits}</td>
                <td className="py-3 pr-4">
                  {artist.verified ? (
                    <span className="inline-flex items-center rounded-full bg-green-900/50 px-2 py-0.5 text-xs text-green-400">Yes</span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-500">No</span>
                  )}
                </td>
                <td className="py-3 pr-4">
                  {artist.featured ? (
                    <span className="inline-flex items-center rounded-full bg-amber-900/50 px-2 py-0.5 text-xs text-amber-400">Yes</span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-500">No</span>
                  )}
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/artists/${artist.id}/edit`} className="rounded p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white"><Pencil className="h-4 w-4" /></Link>
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
