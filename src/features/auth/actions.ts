import { request, clearToken } from "@/lib/api";

export async function login(email: string, password: string) {
  const data = await request<{ accessToken: string; refreshToken: string }>(
    "/v1/auth/login",
    {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        device: { platform: "unknown", deviceName: "Alap Admin" },
      }),
    },
  );
  localStorage.setItem("alap_admin_token", data.accessToken);
  localStorage.setItem("alap_admin_refresh", data.refreshToken);
  await request("/v1/admin/me");
  return data;
}
export function logout() {
  clearToken();
}
export function validateSession() {
  return request("/v1/admin/me");
}
