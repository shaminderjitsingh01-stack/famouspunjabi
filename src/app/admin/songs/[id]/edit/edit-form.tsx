"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const songGenres = ["POP", "HIPHOP", "FOLK", "BHANGRA", "SAD", "ROMANTIC", "DEVOTIONAL", "PARTY", "RAP", "RNB", "ROCK", "SUFI"];

export default function EditSongForm({ song }: { song: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const body = {
      title: form.get("title"),
      titleGurmukhi: form.get("titleGurmukhi") || null,
      year: parseInt(form.get("year") as string),
      album: form.get("album") || null,
      musicVideoYoutubeId: form.get("musicVideoYoutubeId") || null,
      spotifyUrl: form.get("spotifyUrl") || null,
      label: form.get("label") || null,
      genre: form.get("genre"),
    };
    try {
      const res = await fetch(`/api/admin/songs/${song.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) { const data = await res.json(); throw new Error(data.error || "Failed to update"); }
      router.push("/admin/songs");
      router.refresh();
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this song? This cannot be undone.")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/songs/${song.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      router.push("/admin/songs");
      router.refresh();
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Edit Song</h1>
        <button onClick={handleDelete} disabled={loading} className="rounded-lg bg-red-900/50 border border-red-800 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-900 disabled:opacity-50">
          Delete Song
        </button>
      </div>
      {error && <div className="mt-4 rounded-lg bg-red-900/50 border border-red-800 p-3 text-sm text-red-300">{error}</div>}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Title *</label>
          <input name="title" required defaultValue={song.title} className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Title (Gurmukhi)</label>
          <input name="titleGurmukhi" defaultValue={song.titleGurmukhi || ""} className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Year *</label>
            <input name="year" type="number" required defaultValue={song.year} className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Genre</label>
            <select name="genre" defaultValue={song.genre} className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none">
              {songGenres.map(g => <option key={g} value={g}>{g.charAt(0) + g.slice(1).toLowerCase()}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Music Video YouTube ID</label>
          <input name="musicVideoYoutubeId" defaultValue={song.musicVideoYoutubeId || ""} className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Spotify URL</label>
          <input name="spotifyUrl" type="url" defaultValue={song.spotifyUrl || ""} className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Album</label>
            <input name="album" defaultValue={song.album || ""} className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Label</label>
            <input name="label" defaultValue={song.label || ""} className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none" />
          </div>
        </div>
        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={loading} className="rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-semibold text-black hover:bg-amber-400 disabled:opacity-50">{loading ? "Saving..." : "Save Changes"}</button>
          <button type="button" onClick={() => router.back()} className="rounded-lg bg-gray-800 px-6 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-700">Cancel</button>
        </div>
      </form>
    </div>
  );
}
