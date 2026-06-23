import { X } from "lucide-react";

function TrailerModal({ title, trailerUrl, onClose }) {
  if (!trailerUrl) return null;

  return (
    <div className="trailer-modal" role="dialog" aria-modal="true" aria-label={`Trailer ${title || "phim"}`}>
      <button className="trailer-modal-backdrop" type="button" aria-label="Đóng trailer" onClick={onClose} />
      <section className="trailer-modal-panel">
        <header>
          <h2>{title ? `Trailer ${title}` : "Trailer phim"}</h2>
          <button type="button" aria-label="Đóng trailer" onClick={onClose}>
            <X size={22} />
          </button>
        </header>
        <div className="trailer-modal-frame">
          <iframe
            src={toEmbedTrailerUrl(trailerUrl)}
            title={title ? `Trailer ${title}` : "Trailer phim"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </section>
    </div>
  );
}

function toEmbedTrailerUrl(url) {
  const normalizedUrl = normalizeTrailerUrl(url);

  try {
    const parsed = new URL(normalizedUrl);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const videoId = parsed.pathname.split("/").filter(Boolean)[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : normalizedUrl;
    }

    if (host.endsWith("youtube.com")) {
      const videoId = parsed.searchParams.get("v");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;

      const parts = parsed.pathname.split("/").filter(Boolean);
      const embedIndex = parts.findIndex((part) => part === "embed" || part === "shorts");
      if (embedIndex >= 0 && parts[embedIndex + 1]) {
        return `https://www.youtube.com/embed/${parts[embedIndex + 1]}`;
      }
    }

    if (host.endsWith("vimeo.com")) {
      const videoId = parsed.pathname.split("/").filter(Boolean).pop();
      return videoId ? `https://player.vimeo.com/video/${videoId}` : normalizedUrl;
    }
  } catch {
    return normalizedUrl;
  }

  return normalizedUrl;
}

function normalizeTrailerUrl(url) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}

export default TrailerModal;
