import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFollowers(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toString();
}

export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

export function getYouTubeThumbnail(videoId: string, quality: 'default' | 'hq' | 'maxres' = 'hq'): string {
  const q = quality === 'hq' ? 'hqdefault' : quality === 'maxres' ? 'maxresdefault' : 'default';
  return `https://img.youtube.com/vi/${videoId}/${q}.jpg`;
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function formatGenre(genre: string): string {
  return genre.charAt(0) + genre.slice(1).toLowerCase();
}

export function formatArtistType(type: string): string {
  if (type === 'MULTI') return 'Actor / Singer';
  if (type === 'MUSIC_DIRECTOR') return 'Music Director';
  return type.charAt(0) + type.slice(1).toLowerCase();
}

export function formatCreditRole(role: string): string {
  return role.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

export function timeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}
