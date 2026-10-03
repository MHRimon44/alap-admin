import { request } from "@/lib/api";
export function getDashboardMetrics() {
  return request<{
    totalUsers: number;
    activeUsers: number;
    disabledUsers: number;
    newUsersToday: number;
    activeSessions: number;
    conversations: number;
    messages: number;
    reactions: number;
  }>("/v1/admin/dashboard");
}
