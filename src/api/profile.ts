import { API_BASE } from "./auth";

// Profile API
export async function getProfile() {
  const token = localStorage.getItem("authToken");
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}/user/profile`, {
    method: "GET",
    headers,
    credentials: "include",
  });

  const raw = await res.text().catch(() => "");
  let data: any = {};
  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      data = { rawText: raw };
    }
  }

  return { res, raw, data };
}