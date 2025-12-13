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

export async function getAllReservations() {
  const res = await fetch(`${API_BASE}/reservation/all`, {
    method: "GET",
    credentials: "include",
  });

  if (res.ok) {
    return { success: true, data: await res.json() };
  } else {
    return { success: false, status: res.status, data: await res.text() };
  }
}

export async function getReservationsByStatus(status: string) {
  const res = await fetch(`${API_BASE}/reservation/status/${status}`, {
    method: "GET",
    credentials: "include",
  });

  if (res.ok) {
    return { success: true, data: await res.json() };
  } else {
    return { success: false, status: res.status, data: await res.text() };
  }
}

export async function reviewReservation(
  id: string,
  status: string,
  rejectReason?: string | null
) {
  const res = await fetch(`${API_BASE}/reservation/${id}/review`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      status,
      reject_reason: rejectReason ?? null,
    }),
  });

  if (res.ok) {
    return { success: true, data: await res.text() };
  } else {
    return { success: false, status: res.status, data: await res.text() };
  }
}

