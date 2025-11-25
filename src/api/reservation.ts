import { API_BASE } from "./auth";

export async function createReservation(
  classroomId: string,
  startTime: string,
  endTime: string,
  purpose: string
) {
  const body = {
    classroom_id: classroomId,
    start_time: startTime,
    end_time: endTime,
    purpose,
  };

  const res = await fetch(`${API_BASE}/reservation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  if (res.ok) {
    return { success: true, status: res.status, data: await res.json() };
  } else {
    return { success: false, status: res.status, data: await res.text() };
  }
}
