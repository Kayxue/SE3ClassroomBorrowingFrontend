import { API_BASE } from "./auth";

export async function getClassroomList() {
	const res = await fetch(`${API_BASE}/classroom`, {
		method: "GET",
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

export async function updateClassroomPhoto(id: string, file: File) {
	const fd = new FormData();
	fd.append("photo", file);

	const res = await fetch(`${API_BASE}/classroom/${id}/photo`, {
		method: "PUT",
		body: fd,
    credentials: "include",
	});

	if (res.ok) {
		return { success: true, status: res.status, data: await res.json() };
	}

	return { success: false, status: res.status, data: await res.text() };
}

export async function createClassroom(formData: FormData) {
	const res = await fetch(`${API_BASE}/classroom`, {
		method: "POST",
		body: formData,
		credentials: "include",
	});

	if (res.ok) {
		return { success: true, status: res.status, data: await res.json() };
	}

	return { success: false, status: res.status, data: await res.text() };
}

export async function deleteClassroom(id: string) {
  const res = await fetch(`${API_BASE}/classroom/${id}`, {
    method: "DELETE",
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  return { res, data };
}

export async function updateClassroom(id: string, body: any) {
  const res = await fetch(`${API_BASE}/classroom/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  return { res, data };
}


export async function getClassroomById(id: string) {
  const res = await fetch(`${API_BASE}/classroom/${id}`, {
    credentials: "include",
  });

  let data: any;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  return {
    success: res.ok,
    status: res.status,
    data,
  };
}


export async function getClassroomWithKey(id: string) {
  const res = await fetch(`${API_BASE}/classroom/${id}?with_keys=true`, {
    credentials: "include",
  });

  let rawText = "";
  try {
    rawText = await res.text();
  } catch {}

  let data: any;
  try {
    data = JSON.parse(rawText);
  } catch {
    data = rawText;
  }

  return {
    success: res.ok,
    status: res.status,
    data,
  };
}

