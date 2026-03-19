"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { getYouTubeEmbedUrl, getYouTubeThumbnail } from "@/lib/utils";

interface VideoEmbedProps {
  youtubeId: string;
  title: string;
  className?: string;
  autoplay?: boolean;
  lazy?: boolean; // show thumbnail first, load iframe on click
}

export function VideoEmbed({ youtubeId, title, className, autoplay = false, lazy = true }: VideoEmbedProps) {
  const [playing, setPlaying] = useState(!lazy);

  if (!playing) {
    return (
      <div
        className={`relative aspect-video overflow-hidden rounded-xl cursor-pointer group ${className || ""}`}
        onClick={() => setPlaying(true)}
      >
        <img
          src={getYouTubeThumbnail(youtubeId, 'maxres')}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-full bg-amber-500 p-4 shadow-lg shadow-amber-500/25 group-hover:scale-110 transition-transform">
            <Play className="h-8 w-8 text-black fill-black" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <p className="text-sm font-medium text-white truncate">{title}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative aspect-video overflow-hidden rounded-xl ${className || ""}`}>
      <iframe
        src={`${getYouTubeEmbedUrl(youtubeId)}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}
