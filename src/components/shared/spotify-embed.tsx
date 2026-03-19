interface SpotifyEmbedProps {
  spotifyUrl: string;
  className?: string;
}

export function SpotifyEmbed({ spotifyUrl, className }: SpotifyEmbedProps) {
  // Convert spotify URL to embed URL
  // e.g. https://open.spotify.com/track/xxx -> https://open.spotify.com/embed/track/xxx
  const embedUrl = spotifyUrl.replace("spotify.com/", "spotify.com/embed/");

  return (
    <div className={className}>
      <iframe
        src={embedUrl}
        width="100%"
        height="152"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="rounded-xl"
      />
    </div>
  );
}
