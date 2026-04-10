import { useLocation } from "wouter";

export default function Navbar() {
  const [location, navigate] = useLocation();

  const isHidden = location === "/login" || location === "/admin";
  if (isHidden) return null;

  return (
    <nav
      className="nav-glass"
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 1000,
        padding: "1rem 2rem",
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div
          className="glow-text"
          style={{ fontSize: "1.45rem", fontWeight: 800, letterSpacing: "-0.5px", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          FrameX Studios
        </div>
        <ul style={{ display: "flex", gap: "2.5rem", listStyle: "none", margin: 0, padding: 0 }}>
          <li>
            <button
              onClick={() => navigate("/")}
              style={{
                background: "none",
                border: "none",
                color: location === "/" ? "#fff" : "#c0c0c0",
                fontSize: "0.95rem",
                fontWeight: location === "/" ? 600 : 400,
                cursor: "pointer",
                transition: "color 0.2s",
                padding: 0,
              }}
            >
              Home
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/work")}
              style={{
                background: "none",
                border: "none",
                color: location === "/work" ? "#fff" : "#c0c0c0",
                fontSize: "0.95rem",
                fontWeight: location === "/work" ? 600 : 400,
                cursor: "pointer",
                transition: "color 0.2s",
                padding: 0,
              }}
            >
              Work
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
