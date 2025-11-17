export const API_BASE =
  (import.meta as any)?.env?.VITE_API_BASE ?? "/api";

// login API
export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email, password }),
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
