export const API_BASE =
  (import.meta as any)?.env?.VITE_API_BASE ?? "/api";

export async function logout() {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  const res = await fetch(`${API_BASE}/user/logout`, {
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
