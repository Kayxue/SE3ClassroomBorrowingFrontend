import { API_BASE } from "./auth";

// Profile API
export async function getProfile() {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

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

export async function updateProfile(payload: {
  email?: string | null;
  name?: string | null;
  phone_number?: string | null;
  username?: string | null;
}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const res = await fetch(`${API_BASE}/user/update-profile`, {
    method: "PUT",
    headers,
    credentials: "include",
    body: JSON.stringify(payload),
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