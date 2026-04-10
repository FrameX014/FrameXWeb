import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { getAuthStatus, logout, listMedia, createMedia, deleteMedia } from "../lib/api";

type MediaItem = {
  id: number;
  category: string;
  section: string;
  url: string;
  type: string;
  youtubeId?: string | null;
  createdAt: string;
};

type Tab = { category: "editing" | "thumbnails"; section: "gaming" | "other"; label: string };

const TABS: Tab[] = [
  { category: "editing", section: "gaming", label: "Editing — Gaming" },
  { category: "editing", section: "other", label: "Editing — Other" },
  { category: "thumbnails", section: "gaming", label: "Thumbnails — Gaming" },
  { category: "thumbnails", section: "other", label: "Thumbnails — Other" },
];

export default function Admin() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState(0);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ url: "", type: "image", youtubeId: "" });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    getAuthStatus().then((s) => {
      if (!s.authenticated) navigate("/login");
      else fetchMedia();
    });
  }, [navigate]);

  useEffect(() => {
    fetchMedia();
  }, [activeTab]);

  const fetchMedia = async () => {
    setLoading(true);
    const tab = TABS[activeTab];
    try {
      const items = await listMedia(tab.category, tab.section);
      setMedia(items);
    } catch {
      setMedia([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    if (!form.url.trim()) {
      setErr("URL is required");
      return;
    }
    if (form.type === "youtube" && !form.youtubeId.trim()) {
      setErr("YouTube video ID is required for YouTube type");
      return;
    }
    setUploading(true);
    const tab = TABS[activeTab];
    try {
      const res = await createMedia({
        category: tab.category,
        section: tab.section,
        url: form.url,
        type: form.type,
        youtubeId: form.type === "youtube" ? form.youtubeId : null,
      });
      if (res.ok) {
        setMsg("Added successfully!");
        setForm({ url: "", type: "image", youtubeId: "" });
        fetchMedia();
      } else {
        const data = await res.json();
        setErr(data.error || "Failed to add");
      }
    } catch {
      setErr("Connection error");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this item?")) return;
    await deleteMedia(id);
    fetchMedia();
  };

  const tab = TABS[activeTab];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", paddingTop: "4rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "1.9rem", fontWeight: 800, color: "#f0f0f0", letterSpacing: "-0.5px", margin: 0 }}>
              FrameX Admin
            </h1>
            <p style={{ color: "#555", fontSize: "0.9rem", margin: "0.3rem 0 0" }}>Manage your portfolio content</p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              padding: "0.6rem 1.3rem",
              color: "#bbb",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: 500,
              transition: "all 0.2s",
            }}
          >
            Sign Out
          </button>
        </div>

        <div style={{ display: "flex", gap: "0.6rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          {TABS.map((t, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              style={{
                padding: "0.6rem 1.2rem",
                borderRadius: 10,
                border: "1px solid",
                borderColor: activeTab === i ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)",
                background: activeTab === i ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)",
                color: activeTab === i ? "#f0f0f0" : "#888",
                cursor: "pointer",
                fontSize: "0.88rem",
                fontWeight: activeTab === i ? 600 : 400,
                transition: "all 0.2s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "2rem", alignItems: "start" }}>
          <div className="glass" style={{ borderRadius: 16, padding: "1.8rem" }}>
            <h3 style={{ color: "#ccc", fontSize: "1rem", fontWeight: 600, marginBottom: "1.4rem" }}>
              {tab.label} — {media.length} item{media.length !== 1 ? "s" : ""}
            </h3>

            {loading ? (
              <p style={{ color: "#555", textAlign: "center", padding: "2rem 0" }}>Loading...</p>
            ) : media.length === 0 ? (
              <p style={{ color: "#555", textAlign: "center", padding: "2rem 0" }}>No items yet. Add one using the form.</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
                {media.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 12,
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    {item.type === "youtube" && item.youtubeId ? (
                      <img
                        src={`https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`}
                        alt=""
                        style={{ width: "100%", height: 120, objectFit: "cover", display: "block" }}
                      />
                    ) : item.type === "image" ? (
                      <img
                        src={item.url}
                        alt=""
                        style={{ width: "100%", height: 120, objectFit: "cover", display: "block" }}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div style={{ height: 80, display: "flex", alignItems: "center", justifyContent: "center", background: "#111", color: "#555", fontSize: "0.8rem" }}>
                        Video
                      </div>
                    )}
                    <div style={{ padding: "0.7rem" }}>
                      <p style={{ color: "#666", fontSize: "0.75rem", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.type.toUpperCase()}
                      </p>
                      <button
                        onClick={() => handleDelete(item.id)}
                        style={{
                          marginTop: "0.5rem",
                          width: "100%",
                          background: "rgba(239,68,68,0.12)",
                          border: "1px solid rgba(239,68,68,0.25)",
                          borderRadius: 7,
                          color: "#f87171",
                          cursor: "pointer",
                          padding: "0.35rem 0",
                          fontSize: "0.8rem",
                          fontWeight: 500,
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass" style={{ borderRadius: 16, padding: "1.8rem" }}>
            <h3 style={{ color: "#ccc", fontSize: "1rem", fontWeight: 600, marginBottom: "1.4rem" }}>
              Add New Item
            </h3>
            <form onSubmit={handleAdd}>
              <div style={{ marginBottom: "1.1rem" }}>
                <label style={{ display: "block", color: "#888", fontSize: "0.82rem", marginBottom: "0.4rem", fontWeight: 500 }}>
                  Type
                </label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value, youtubeId: "" }))}
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 9,
                    padding: "0.65rem 0.9rem",
                    color: "#e0e0e0",
                    fontSize: "0.9rem",
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="image">Image (URL)</option>
                  <option value="youtube">YouTube Video</option>
                  <option value="video">Video (URL)</option>
                </select>
              </div>

              <div style={{ marginBottom: "1.1rem" }}>
                <label style={{ display: "block", color: "#888", fontSize: "0.82rem", marginBottom: "0.4rem", fontWeight: 500 }}>
                  {form.type === "youtube" ? "YouTube Embed URL or Video URL" : "Image / Video URL"}
                </label>
                <input
                  type="url"
                  value={form.url}
                  onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                  placeholder={form.type === "youtube" ? "https://youtu.be/..." : "https://..."}
                  required
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 9,
                    padding: "0.65rem 0.9rem",
                    color: "#e0e0e0",
                    fontSize: "0.88rem",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
                />
              </div>

              {form.type === "youtube" && (
                <div style={{ marginBottom: "1.1rem" }}>
                  <label style={{ display: "block", color: "#888", fontSize: "0.82rem", marginBottom: "0.4rem", fontWeight: 500 }}>
                    YouTube Video ID (e.g. 7GzXS61abFY)
                  </label>
                  <input
                    type="text"
                    value={form.youtubeId}
                    onChange={(e) => setForm((f) => ({ ...f, youtubeId: e.target.value }))}
                    placeholder="Video ID from youtube.com/watch?v=..."
                    style={{
                      width: "100%",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 9,
                      padding: "0.65rem 0.9rem",
                      color: "#e0e0e0",
                      fontSize: "0.88rem",
                      outline: "none",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
                  />
                </div>
              )}

              {msg && <p style={{ color: "#4ade80", fontSize: "0.85rem", marginBottom: "0.8rem" }}>{msg}</p>}
              {err && <p style={{ color: "#f87171", fontSize: "0.85rem", marginBottom: "0.8rem" }}>{err}</p>}

              <button
                type="submit"
                disabled={uploading}
                className="cta-btn"
                style={{ width: "100%", textAlign: "center", opacity: uploading ? 0.7 : 1, fontSize: "0.95rem" }}
              >
                {uploading ? "Adding..." : "Add Item"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
