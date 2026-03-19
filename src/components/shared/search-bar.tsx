"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  defaultValue?: string;
  size?: "sm" | "lg";
}

export function SearchBar({ className, placeholder = "Search movies, songs, artists...", defaultValue = "", size = "sm" }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <Search className={cn(
        "absolute left-3 top-1/2 -translate-y-1/2 text-gray-500",
        size === "lg" ? "h-5 w-5" : "h-4 w-4"
      )} />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-xl border border-gray-800 bg-gray-900 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500",
          size === "lg" ? "py-4 pl-12 pr-4 text-lg" : "py-2.5 pl-10 pr-4 text-sm"
        )}
      />
    </form>
  );
}
