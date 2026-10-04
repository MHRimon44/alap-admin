import { request } from "@/lib/api";
import type { AdminUser, AdminUserDetails } from "./types";

export function getUsers(q = "", status = "") {
  const params = new URLSearchParams({ limit: "100" });
  if (q) params.set("query", q);
  if (status) params.set("status", status);
  return request<{
    items: AdminUser[];
    total: number;
    page: number;
    pages: number;
  }>(`/v1/admin/users?${params.toString()}`);
}
export function getUser(id: string) {
  return request<AdminUserDetails>(`/v1/admin/users/${encodeURIComponent(id)}`);
}
export function updateStatus(id: string, status: AdminUser["status"]) {
  return request<AdminUser>(
    `/v1/admin/users/${encodeURIComponent(id)}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    },
  );
}
export function revokeSessions(id: string) {
  return request<{ revoked: number }>(
    `/v1/admin/users/${encodeURIComponent(id)}/revoke-sessions`,
    { method: "POST" },
  );
}
export function deleteUser(id: string) {
  return request<{ deleted: true }>(
    `/v1/admin/users/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    },
  );
}

export function resetUserPassword(id: string, password: string) {
  return request<{ reset: true; revoked: number }>(
    `/v1/admin/users/${encodeURIComponent(id)}/reset-password`,
    { method: "POST", body: JSON.stringify({ password }) },
  );
}
