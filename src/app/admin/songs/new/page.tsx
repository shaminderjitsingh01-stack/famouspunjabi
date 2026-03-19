"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const songGenres = ["POP", "HIPHOP", "FOLK", "BHANGRA", "SAD", "ROMANTIC", "DEVOTIONAL", "PARTY", "RAP", "RNB", "ROCK", "SUFI"];

export default function NewSongPage() {
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
      const res = await fetch("/api/admin/songs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) { const data = await res.json(); throw new Error(data.error || "Failed to create"); }
      router.push("/admin/songs");
      router.refresh();
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-white">Add Song</h1>
      {error && <div className="mt-4 rounded-lg bg-red-900/50 border border-red-800 p-3 text-sm text-red-300">{error}</div>}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Title *</label>
          <input name="title" required className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Title (Gurmukhi)</label>
          <input name="titleGurmukhi" className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Year *</label>
            <input name="year" type="number" required defaultValue={2024} className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Genre</label>
            <select name="genre" defaultValue="POP" className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none">
              {songGenres.map(g => <option key={g} value={g}>{g.charAt(0) + g.slice(1).toLowerCase()}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Music Video YouTube ID</label>
          <input name="musicVideoYoutubeId" placeholder="e.g. 4BC53WDXR8g" className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Spotify URL</label>
          <input name="spotifyUrl" type="url" className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Album</label>
            <input name="album" className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Label</label>
            <input name="label" placeholder="e.g. Speed Records" className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none" />
          </div>
        </div>
        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={loading} className="rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-semibold text-black hover:bg-amber-400 disabled:opacity-50">{loading ? "Creating..." : "Create Song"}</button>
          <button type="button" onClick={() => router.back()} className="rounded-lg bg-gray-800 px-6 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-700">Cancel</button>
        </div>
      </form>
    </div>
  );
}
