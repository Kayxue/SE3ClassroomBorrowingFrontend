import { API_BASE } from "./auth";

// update password API
export async function updatePassword(payload: {
  old_password: string;
  new_password: string;
  confirm: string;
}) {
  const token = localStorage.getItem("authToken");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}/user/update-password`, {
    method: "PUT",
    headers,
    credentials: "include",
    body: JSON.stringify({
      old_password: payload.old_password,
      new_password: payload.new_password,
      confirm: payload.confirm,
    }),
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
