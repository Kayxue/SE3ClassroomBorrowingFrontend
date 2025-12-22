export const API_BASE = (import.meta as any)?.env?.VITE_API_BASE ?? "/api";

export async function forgotPassword(email: string) {
  const res = await fetch(`${API_BASE}/password/forgot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return res;
}

export async function verifyCode(email: string, code: string) {
  const res = await fetch(`${API_BASE}/password/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });
  return res.json();
}

export async function resetPassword(
  email: string,
  new_password: string,
  reset_token: string,
  confirm: string
) {
  const res = await fetch(`${API_BASE}/password/reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, new_password, reset_token, confirm }),
  });
  return res;
}
