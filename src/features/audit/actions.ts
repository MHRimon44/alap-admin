import { request } from "@/lib/api";
export type AuditItem = {
  id: string;
  actorId: string;
  action: "user.status_changed" | "user.sessions_revoked" | "user.password_reset" | "user.deleted";
  targetUserId?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
};
export function getAuditLog() {
  return request<AuditItem[]>("/v1/admin/audit?limit=100");
}
