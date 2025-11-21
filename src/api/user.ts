import { API_BASE } from "./auth";

export async function getUserById(id: string) {
	const headers: Record<string, string> = { Accept: "application/json" };

	const res = await fetch(`${API_BASE}/user/${encodeURIComponent(id)}`, {
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
