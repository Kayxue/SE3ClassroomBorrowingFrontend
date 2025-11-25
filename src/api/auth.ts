import { data } from "react-router-dom";

export const API_BASE = (import.meta as any)?.env?.VITE_API_BASE ?? "/api";

// login API
export async function login(email: string, password: string) {
	const res = await fetch(`${API_BASE}/user/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify({ email, password }),
		credentials: "include",
	});

	if (res.ok) {
		return { success: true, status: res.status, data: await res.json() };
	}

	return { success: false, status: res.status, data: await res.text() };
}
