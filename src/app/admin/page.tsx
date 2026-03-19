import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Film, Music, Users, Star, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [movieCount, songCount, artistCount, userCount, reviewCount, recentMovies, recentSongs, recentArtists] = await Promise.all([
    prisma.movie.count(),
    prisma.song.count(),
    prisma.artist.count(),
    prisma.user.count(),
    prisma.review.count(),
    prisma.movie.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, title: true, year: true, slug: true } }),
    prisma.song.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, title: true, year: true, slug: true } }),
    prisma.artist.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, name: true, type: true, slug: true } }),
  ]);

  const stats = [
    { label: "Movies", count: movieCount, icon: Film, href: "/admin/movies", color: "text-blue-500" },
    { label: "Songs", count: songCount, icon: Music, href: "/admin/songs", color: "text-green-500" },
    { label: "Artists", count: artistCount, icon: Users, href: "/admin/artists", color: "text-purple-500" },
    { label: "Reviews", count: reviewCount, icon: Star, color: "text-amber-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-gray-800 bg-gray-900 p-4">
            <div className="flex items-center justify-between">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
              {stat.href && (
                <Link href={stat.href} className="text-xs text-gray-500 hover:text-amber-500">View &rarr;</Link>
              )}
            </div>
            <p className="mt-3 text-2xl font-bold text-white">{stat.count}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/admin/movies/new" className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-400 transition-colors">
          <Plus className="h-4 w-4" /> Add Movie
        </Link>
        <Link href="/admin/songs/new" className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-400 transition-colors">
          <Plus className="h-4 w-4" /> Add Song
        </Link>
        <Link href="/admin/artists/new" className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-400 transition-colors">
          <Plus className="h-4 w-4" /> Add Artist
        </Link>
      </div>

      {/* Recent Items */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div>
          <h2 className="text-sm font-semibold text-white mb-3">Recent Movies</h2>
          <div className="space-y-2">
            {recentMovies.map((m) => (
              <Link key={m.id} href={`/admin/movies/${m.id}/edit`} className="flex items-center justify-between rounded-lg bg-gray-900 border border-gray-800 px-3 py-2 hover:border-gray-700 transition-colors">
                <span className="text-sm text-gray-300">{m.title}</span>
                <span className="text-xs text-gray-600">{m.year}</span>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white mb-3">Recent Songs</h2>
          <div className="space-y-2">
            {recentSongs.map((s) => (
              <Link key={s.id} href={`/admin/songs/${s.id}/edit`} className="flex items-center justify-between rounded-lg bg-gray-900 border border-gray-800 px-3 py-2 hover:border-gray-700 transition-colors">
                <span className="text-sm text-gray-300">{s.title}</span>
                <span className="text-xs text-gray-600">{s.year}</span>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white mb-3">Recent Artists</h2>
          <div className="space-y-2">
            {recentArtists.map((a) => (
              <Link key={a.id} href={`/admin/artists/${a.id}/edit`} className="flex items-center justify-between rounded-lg bg-gray-900 border border-gray-800 px-3 py-2 hover:border-gray-700 transition-colors">
                <span className="text-sm text-gray-300">{a.name}</span>
                <span className="text-xs text-gray-600">{a.type}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
