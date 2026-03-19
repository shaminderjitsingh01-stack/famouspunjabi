"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const artistTypes = ["ACTOR", "SINGER", "DIRECTOR", "LYRICIST", "MUSIC_DIRECTOR", "PRODUCER", "COMEDIAN", "MULTI"];

export default function NewArtistPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get("name"),
      nameGurmukhi: form.get("nameGurmukhi") || null,
      bio: form.get("bio") || null,
      photoUrl: form.get("photoUrl") || null,
      birthDate: form.get("birthDate") || null,
      birthPlace: form.get("birthPlace") || null,
      deathDate: form.get("deathDate") || null,
      type: form.get("type"),
      verified: form.get("verified") === "on",
      featured: form.get("featured") === "on",
    };
    try {
      const res = await fetch("/api/admin/artists", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) { const data = await res.json(); throw new Error(data.error || "Failed to create"); }
      router.push("/admin/artists");
      router.refresh();
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-white">Add Artist</h1>
      {error && <div className="mt-4 rounded-lg bg-red-900/50 border border-red-800 p-3 text-sm text-red-300">{error}</div>}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Name *</label>
          <input name="name" required className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Name (Gurmukhi)</label>
          <input name="nameGurmukhi" className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
          <select name="type" defaultValue="MULTI" className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none">
            {artistTypes.map(t => (
              <option key={t} value={t}>{t === "MUSIC_DIRECTOR" ? "Music Director" : t === "MULTI" ? "Actor / Singer" : t.charAt(0) + t.slice(1).toLowerCase()}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Bio</label>
          <textarea name="bio" rows={4} className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Photo URL</label>
          <input name="photoUrl" type="url" className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Birth Date</label>
            <input name="birthDate" type="date" className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Birth Place</label>
            <input name="birthPlace" className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Death Date</label>
          <input name="deathDate" type="date" className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-white focus:border-amber-500 focus:outline-none" />
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-400">
            <input type="checkbox" name="verified" className="rounded border-gray-700 bg-gray-900 text-amber-500 focus:ring-amber-500" />
            Verified
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-400">
            <input type="checkbox" name="featured" className="rounded border-gray-700 bg-gray-900 text-amber-500 focus:ring-amber-500" />
            Featured
          </label>
        </div>
        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={loading} className="rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-semibold text-black hover:bg-amber-400 disabled:opacity-50">{loading ? "Creating..." : "Create Artist"}</button>
          <button type="button" onClick={() => router.back()} className="rounded-lg bg-gray-800 px-6 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-700">Cancel</button>
        </div>
      </form>
    </div>
  );
}
