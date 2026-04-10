import { Router } from "express";
import { AdminLoginBody } from "@workspace/api-zod";

const router = Router();

const ADMIN_USERNAME = "framex_admin";
const ADMIN_PASSWORD = "FrameX@2024!";

const sessions = new Set<string>();

function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

router.post("/auth/login", (req, res) => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }
  const { username, password } = parsed.data;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = generateToken();
    sessions.add(token);
    res.cookie("framex_session", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ success: true, message: "Logged in successfully" });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

router.post("/auth/logout", (req, res) => {
  const token = req.cookies?.framex_session;
  if (token) {
    sessions.delete(token);
    res.clearCookie("framex_session");
  }
  res.json({ success: true, message: "Logged out" });
});

router.get("/auth/me", (req, res) => {
  const token = req.cookies?.framex_session;
  const authenticated = token ? sessions.has(token) : false;
  res.json({ authenticated });
});

export function requireAuth(req: any, res: any, next: any) {
  const token = req.cookies?.framex_session;
  if (!token || !sessions.has(token)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

export default router;
