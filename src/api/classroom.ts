import { API_BASE } from "./auth"; 

export async function getClassroomList() {
  const token = localStorage.getItem("authToken"); 

  const res = await fetch(`${API_BASE}/classroom`, {
    method: "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : "", 
    },
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

export async function uploadClassroomPhoto(id: string, file: File) {
  const fd = new FormData();
  fd.append("photo", file);

  const token = localStorage.getItem("authToken") || "";

  const res = await fetch(`${API_BASE}/classroom/${id}/photo`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: fd,
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

export async function createClassroom(formData: FormData) {
  const token = localStorage.getItem("authToken"); 

  const res = await fetch(`${API_BASE}/classroom`, {
    method: "POST",
    headers: {
      Authorization: token ? `Bearer ${token}` : "", 
    },
    body: formData,
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
