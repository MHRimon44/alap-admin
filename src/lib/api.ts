export function token() {
  return typeof window === "undefined"
    ? null
    : localStorage.getItem("alap_admin_token");
}
export function clearToken() {
  localStorage.removeItem("alap_admin_token");
  localStorage.removeItem("alap_admin_refresh");
}
export async function request<T>(path: string, init: RequestInit = {}) {
  const t = token();
  const r = await fetch(`/api${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(t ? { authorization: `Bearer ${t}` } : {}),
      ...(init.headers ?? {}),
    },
  });
  const body = await r.json().catch(() => ({}));
  if (!r.ok)
    throw new Error(body?.error?.message ?? `Request failed (${r.status})`);
  return body.data as T;
}
