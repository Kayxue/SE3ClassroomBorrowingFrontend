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
  const res = await fetch(`${API_BASE}/reservation/self`, {
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
  const res = await fetch(`${API_BASE}/reservation/self/list?status=${status}`, {
    method: "GET",
    credentials: "include",
  });

  if (res.ok) {
    return { success: true, data: await res.json() };
  } else {
    return { success: false, status: res.status, data: await res.text() };
  }
}

export async function getAdminReservations(status?: string) {
  const query = status && status !== "All" ? `?status=${status}` : "";
  const res = await fetch(`${API_BASE}/reservation/admin/list${query}`, {
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

export const updateReservation = async (id: string, body: any) => {
  try {
    const res = await fetch(`${API_BASE}/reservation/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });

    let data = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }

    return { success: res.ok, data };
  } catch (err) {
    console.error("更新申請錯誤：", err);
    return { success: false, data: null };
  }
};

export const deleteReservation = async (id: string) => {
  try {
    const res = await fetch(`${API_BASE}/reservation/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    return { success: res.ok };
  } catch (err) {
    console.error("刪除申請錯誤：", err);
    return { success: false };
  }
};
