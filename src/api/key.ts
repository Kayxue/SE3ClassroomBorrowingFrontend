import { API_BASE } from "./auth";

// 安全回傳解析工具
async function safeParse(res: Response) {
  let raw = "";
  try { raw = await res.text(); } catch {}
  try { return JSON.parse(raw); } catch { return raw; }
}

// 建立鑰匙
export async function createKey(classroom_id: string, key_number: string) {
  const res = await fetch(`${API_BASE}/key`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ classroom_id, key_number }),
    credentials: "include",
  });
  return { success: res.ok, status: res.status, data: await safeParse(res) };
}

// 借出鑰匙
export async function borrowKey(key_id: string, borrowed_at: string, deadline: string, reservation_id: string) {
  const res = await fetch(`${API_BASE}/key/${key_id}/borrow`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ borrowed_at, deadline, reservation_id }),
    credentials: "include",
  });
  return { success: res.ok, status: res.status, data: await safeParse(res) };
}

// 歸還鑰匙
export const returnKey = async (keyLogId: string, returned_at: string, on_time: boolean | null) => {
  try {
    const res = await fetch(`${API_BASE}/key/${keyLogId}/return`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ returned_at, on_time }),
    });

    const data = await res.text();
    return { success: res.ok, status: res.status, data };
  } catch (err: any) {
    return { success: false, status: 0, data: err?.message || "network error" };
  }
};

// 取得指定 reservation 的 key logs（找尚未歸還的那一筆）
export async function getKeyLogsByReservation(reservationId: string) {
  const res = await fetch(
    `/api/key/logs?reservation_id=${reservationId}&returned=false`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (res.ok) {
    return { success: true, data: await res.json() };
  } else {
    return { success: false, status: res.status };
  }
}

export async function getKeyLogs(params: { returned?: boolean } = {}) {
  const query = new URLSearchParams();
  if (params.returned !== undefined) query.append("returned", String(params.returned));

  const res = await fetch(`${API_BASE}/key/logs?${query.toString()}`, {
    credentials: "include",
  });

  return {
    success: res.ok,
    status: res.status,
    data: await safeParse(res),
  };
}