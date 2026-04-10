import { useState, useEffect } from "react";
import { listMedia } from "../lib/api";

type MediaItem = {
  id: number;
  category: string;
  section: string;
  url: string;
  type: string;
  youtubeId?: string | null;
  createdAt: string;
};

type ActiveView = {
  category: "editing" | "thumbnails";
  section: "gaming" | "other";
} | null;

const DEFAULT_EDITING_GAMING_VIDEOS = [
  { id: -1, category: "editing", section: "gaming", url: "https://www.youtube.com/embed/7GzXS61abFY", type: "youtube", youtubeId: "7GzXS61abFY", createdAt: "" },
  { id: -2, category: "editing", section: "gaming", url: "https://www.youtube.com/embed/m3iYZhERYg0", type: "youtube", youtubeId: "m3iYZhERYg0", createdAt: "" },
];

export default function Work() {
  const [active, setActive] = useState<ActiveView>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadMedia = async (category: string, section: string) => {
    setLoading(true);
    try {
      const items = await listMedia(category, section);
      setMedia(items);
    } catch {
      setMedia([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (category: "editing" | "thumbnails", section: "gaming" | "other") => {
    setActive({ category, section });
    loadMedia(category, section);
  };

  const back = () => setActive(null);

  const allItems = active
    ? active.category === "editing" && active.section === "gaming"
      ? [...media, ...DEFAULT_EDITING_GAMING_VIDEOS]
      : media
    : [];

  const categories = [
    {
      key: "editing" as const,
      title: "Editing",
      icon: "🎬",
      subs: [
        { key: "gaming" as const, label: "Gaming" },
        { key: "other" as const, label: "Other" },
      ],
    },
    {
      key: "thumbnails" as const,
      title: "Thumbnails",
      icon: "🖼",
      subs: [
        { key: "gaming" as const, label: "Gaming" },
        { key: "other" as const, label: "Other" },
      ],
    },
  ];

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", paddingTop: "5rem" }}>
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "3rem 2rem" }}>
        {!active ? (
          <>
            <h2
              style={{
                fontSize: "clamp(2rem, 5vw, 3.2rem)",
                fontWeight: 800,
                textAlign: "center",
                marginBottom: "3rem",
                color: "#f0f0f0",
                letterSpacing: "-1px",
              }}
            >
              Our Work
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "2rem",
              }}
            >
              {categories.map((cat) => (
                <div
                  key={cat.key}
                  className="glass"
                  style={{
                    borderRadius: 20,
                    padding: "2.5rem 2rem",
                    textAlign: "center",
                    transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                    cursor: "default",
                  }}
                >
                  <h3 style={{ fontSize: "2rem", fontWeight: 700, color: "#f0f0f0", marginBottom: "1.5rem" }}>
                    {cat.title}
                  </h3>
                  <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                    {cat.subs.map((sub) => (
                      <button
                        key={sub.key}
                        onClick={() => handleSelect(cat.key, sub.key)}
                        style={{
                          background: "rgba(255,255,255,0.08)",
                          border: "1px solid rgba(255,255,255,0.12)",
                          borderRadius: 10,
                          padding: "0.65rem 1.4rem",
                          color: "#e0e0e0",
                          fontSize: "0.95rem",
                          fontWeight: 500,
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.15)";
                          (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.25)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
                          (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)";
                        }}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
              <button
                onClick={back}
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 10,
                  padding: "0.55rem 1.2rem",
                  color: "#ccc",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  transition: "all 0.2s",
                }}
              >
                ← Back
              </button>
              <h2 style={{ fontSize: "clamp(1.4rem, 3.5vw, 2rem)", fontWeight: 700, color: "#f0f0f0", margin: 0 }}>
                {active.category.charAt(0).toUpperCase() + active.category.slice(1)} — {active.section.charAt(0).toUpperCase() + active.section.slice(1)}
              </h2>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", color: "#666", padding: "4rem 0" }}>Loading...</div>
            ) : allItems.length === 0 ? (
              <div style={{ textAlign: "center", color: "#555", padding: "5rem 0", fontSize: "1.1rem" }}>
                No items yet. Check back soon.
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: active.category === "thumbnails"
                    ? "repeat(auto-fill, minmax(300px, 1fr))"
                    : "repeat(auto-fill, minmax(340px, 1fr))",
                  gap: "1.8rem",
                }}
              >
                {allItems.map((item) => (
                  <div
                    key={item.id}
                    className="glass"
                    style={{
                      borderRadius: 16,
                      overflow: "hidden",
                      transition: "all 0.35s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 36px rgba(255,255,255,0.07)";
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.09)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "none";
                      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    }}
                  >
                    {(item.type === "youtube" || item.type === "video") && item.youtubeId ? (
                      <div className="video-wrapper">
                        <iframe
                          src={`https://www.youtube.com/embed/${item.youtubeId}`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title="video"
                        />
                      </div>
                    ) : item.type === "video" ? (
                      <video
                        src={item.url}
                        controls
                        style={{ width: "100%", display: "block", borderRadius: 16 }}
                      />
                    ) : (
                      <img
                        src={item.url}
                        alt=""
                        style={{
                          width: "100%",
                          height: active.category === "thumbnails" ? "auto" : "220px",
                          objectFit: active.category === "thumbnails" ? "contain" : "cover",
                          display: "block",
                          background: "#111",
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
