const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export async function apiFetch(path: string, opts?: RequestInit) {
  const res = await fetch(`${BASE}/api${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  return res;
}

export async function login(username: string, password: string) {
  const res = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  return res;
}

export async function logout() {
  return apiFetch("/auth/logout", { method: "POST" });
}

export async function getAuthStatus() {
  const res = await apiFetch("/auth/me");
  return res.json() as Promise<{ authenticated: boolean }>;
}

export async function listMedia(category?: string, section?: string) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (section) params.set("section", section);
  const res = await apiFetch(`/media?${params}`);
  return res.json();
}

export async function createMedia(data: {
  category: string;
  section: string;
  url: string;
  type: string;
  youtubeId?: string | null;
}) {
  const res = await apiFetch("/media", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res;
}

export async function deleteMedia(id: number) {
  return apiFetch(`/media/${id}`, { method: "DELETE" });
}
