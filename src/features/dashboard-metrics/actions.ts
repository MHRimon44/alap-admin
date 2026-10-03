import { request } from "@/lib/api";
export function getDashboardMetrics() {
  return request<{
    totalUsers: number;
    activeUsers: number;
    disabledUsers: number;
    newUsersToday: number;
    activeSessions: number;
  }>("/v1/admin/dashboard");
}
