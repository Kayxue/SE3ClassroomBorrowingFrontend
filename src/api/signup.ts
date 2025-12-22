import { API_BASE } from "./auth";

// register API
export async function register(payload: {
  email: string;
  name: string;
  password: string;
  phone_number: string;
  student_id: string;
  username: string;
}) {
  const res = await fetch(`${API_BASE}/user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
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

  if (!res.ok) {
    if (res.status === 500 && raw.includes("Failed to create user")) {
      data.message = data.message ?? "此email已註冊!!";
    } else {
      data.message = data.message ?? `註冊失敗（status ${res.status}）`;
    }
  }

  return { res, raw, data };
}
