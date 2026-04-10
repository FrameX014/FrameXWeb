import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

export default function Home() {
  const [, navigate] = useLocation();
  const aboutRef = useRef<HTMLElement>(null);
  const foundersRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.15 }
    );
    [aboutRef, foundersRef, ctaRef].forEach((r) => {
      if (r.current) observer.observe(r.current);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <section
        className="fade-in"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "8rem 2rem 4rem",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <h1
          className="glow-text"
          style={{ fontSize: "clamp(2.4rem, 7vw, 5.5rem)", fontWeight: 800, letterSpacing: "-2px", lineHeight: 1.05, marginBottom: "1.4rem" }}
        >
          FrameX Studios
        </h1>
        <p
          style={{
            fontSize: "clamp(1rem, 2vw, 1.35rem)",
            maxWidth: 680,
            color: "#b0b0b0",
            lineHeight: 1.65,
            marginBottom: "2.8rem",
          }}
        >
          We craft cinematic edits, high-converting thumbnails, and premium content experiences.
        </p>
        <button className="cta-btn" onClick={() => navigate("/work")}>
          Explore Our Work
        </button>
      </section>

      <section
        ref={aboutRef}
        className="section-fade"
        style={{ textAlign: "center", padding: "5rem 2rem", maxWidth: 1400, margin: "0 auto" }}
      >
        <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, marginBottom: "1.8rem", color: "#f0f0f0" }}>
          About Us
        </h2>
        <p style={{ fontSize: "1.1rem", color: "#9a9a9a", maxWidth: 780, margin: "0 auto", lineHeight: 1.85 }}>
          FrameX Studios is a premium creative agency specializing in cinematic video editing, high-converting thumbnails, and bespoke content creation. We partner with creators and brands to elevate their storytelling through meticulous craft, innovative design, and strategic content optimization. Every frame, every edit, every pixel matters.
        </p>
      </section>

      <section
        ref={foundersRef}
        className="section-fade"
        style={{ textAlign: "center", padding: "5rem 2rem", maxWidth: 1400, margin: "0 auto" }}
      >
        <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, marginBottom: "3rem", color: "#f0f0f0" }}>
          Founders
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", maxWidth: 560, margin: "0 auto" }}>
          {[
            { name: "Shubh", role: "Creative Director & Editor" },
            { name: "Nehith", role: "Design & Strategy Lead" },
          ].map((f) => (
            <div
              key={f.name}
              className="glass glass-hover"
              style={{ borderRadius: 18, padding: "2.2rem 1.8rem", cursor: "default" }}
            >
              <h3 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#f8f8f8", marginBottom: "0.5rem" }}>{f.name}</h3>
              <p style={{ color: "#888", fontSize: "0.9rem" }}>{f.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        ref={ctaRef}
        className="section-fade"
        style={{ textAlign: "center", padding: "6rem 2rem 8rem", maxWidth: 1400, margin: "0 auto" }}
      >
        <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, marginBottom: "2rem", color: "#f0f0f0" }}>
          Let's Build Something Cinematic
        </h2>
        <button className="cta-btn" onClick={() => navigate("/work")}>
          View Our Work
        </button>
      </section>
    </div>
  );
}
