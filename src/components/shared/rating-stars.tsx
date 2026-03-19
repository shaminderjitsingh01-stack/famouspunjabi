"use client";

import { Star } from "lucide-react";
import { cn, formatRating } from "@/lib/utils";

interface RatingDisplayProps {
  rating: number;
  count?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function RatingDisplay({ rating, count, size = "md", className }: RatingDisplayProps) {
  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-lg",
  };
  const starSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-6 w-6",
  };

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <Star className={cn(starSizes[size], "text-amber-500 fill-amber-500")} />
      <span className={cn(sizeClasses[size], "font-bold text-white")}>
        {rating > 0 ? formatRating(rating) : "\u2014"}
      </span>
      {count !== undefined && (
        <span className={cn(sizeClasses[size], "text-gray-500")}>
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
}

interface RatingInputProps {
  value: number;
  onChange: (score: number) => void;
  className?: string;
}

export function RatingInput({ value, onChange, className }: RatingInputProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
        <button
          key={score}
          onClick={() => onChange(score)}
          className={cn(
            "w-8 h-8 rounded-md text-xs font-bold transition-all",
            score <= value
              ? "bg-amber-500 text-black"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
          )}
        >
          {score}
        </button>
      ))}
    </div>
  );
}
