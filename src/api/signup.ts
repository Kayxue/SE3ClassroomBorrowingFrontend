import { API_BASE } from "./auth";

// register API
export async function register(payload: {
  email: string;
  name: string;
  password: string;
  phone_number: string;
  username: string;
}) {
  const res = await fetch(`${API_BASE}/user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
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

  // 不再在前端保存明文密碼（安全考量）
  return { res, raw, data };
}
