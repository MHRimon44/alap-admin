import { request } from "@/lib/api";
import type { AdminUser } from "./types";
export function getUsers(q = "") {
  return request<{
    items: AdminUser[];
    total: number;
    page: number;
    pages: number;
  }>(`/v1/admin/users?limit=100${q ? `&query=${encodeURIComponent(q)}` : ""}`);
}
export function updateStatus(id: string, status: AdminUser["status"]) {
  return request<AdminUser>(
    `/v1/admin/users/${encodeURIComponent(id)}/status`,
    { method: "PATCH", body: JSON.stringify({ status }) },
  );
}
export function revokeSessions(id: string) {
  return request<{ revoked: number }>(
    `/v1/admin/users/${encodeURIComponent(id)}/revoke-sessions`,
    { method: "POST" },
  );
}
