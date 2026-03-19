"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const genreOptions = ["COMEDY", "ROMANCE", "ACTION", "DRAMA", "THRILLER", "FAMILY", "DEVOTIONAL", "HISTORICAL", "BIOGRAPHICAL", "HORROR", "MUSICAL", "DOCUMENTARY"];
const languageOptions = ["PUNJABI", "HINDI_PUNJABI", "ENGLISH_PUNJABI"];
const statusOptions = ["RELEASED", "ANNOUNCED", "PRE_PRODUCTION", "FILMING", "POST_PRODUCTION"];

export default function NewMoviePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const genres = genreOptions.filter(g => form.get(`genre_${g}`) === "on");

    const body = {
      title: form.get("title"),
      titleGurmukhi: form.get("titleGurmukhi") || null,
      year: parseInt(form.get("year") as string),
      runtime: form.get("runtime") ? parseInt(form.get("runtime") as string) : null,
      synopsis: form.get("synopsis") || null,
      posterUrl: form.get("posterUrl") || null,
      trailerYoutubeId: form.get("trailerYoutubeId") || null,
      language: form.get("language"),
      status: form.get("status"),
      boxOffice: form.get("boxOffice") || null,
      genres,
    };

    try {
      const res = await fetch("/api/admin/movies", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) { const data = await res.json(); throw new Error(data.error || "Failed to create movie"); }
      router.push("/admin/movies");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-white">Add Movie</h1>
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
            <label className="block text-sm font-medium text-gray-300 mb-1">Runtime (min)</label>
            <input name="runtime" type="number" className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Synopsis</label>
          <textarea name="synopsis" rows={3} className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Trailer YouTube ID</label>
          <input name="trailerYoutubeId" placeholder="e.g. BcDfOLBqH5c" className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Poster URL</label>
          <input name="posterUrl" type="url" className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Language</label>
            <select name="language" defaultValue="PUNJABI" className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none">
              {languageOptions.map(l => <option key={l} value={l}>{l.replace(/_/g, " ")}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
            <select name="status" defaultValue="RELEASED" className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none">
              {statusOptions.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Box Office</label>
          <input name="boxOffice" placeholder="e.g. $45 Cr" className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Genres</label>
          <div className="flex flex-wrap gap-3">
            {genreOptions.map(g => (
              <label key={g} className="flex items-center gap-2 text-sm text-gray-400">
                <input type="checkbox" name={`genre_${g}`} className="rounded border-gray-700 bg-gray-900 text-amber-500 focus:ring-amber-500" />
                {g.charAt(0) + g.slice(1).toLowerCase()}
              </label>
            ))}
          </div>
        </div>
        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={loading} className="rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-semibold text-black hover:bg-amber-400 disabled:opacity-50">
            {loading ? "Creating..." : "Create Movie"}
          </button>
          <button type="button" onClick={() => router.back()} className="rounded-lg bg-gray-800 px-6 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-700">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
