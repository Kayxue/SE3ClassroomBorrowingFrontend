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
