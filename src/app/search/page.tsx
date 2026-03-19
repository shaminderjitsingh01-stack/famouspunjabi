import { Suspense } from "react";
import SearchContent from "./search-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Punjabi movies, songs, and artists on FamousPunjabi.",
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-8"><p className="text-gray-500">Loading...</p></div>}>
      <SearchContent />
    </Suspense>
  );
}
