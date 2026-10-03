import { request } from "@/lib/api";
export function getSystemHealth() {
  return request<{
    ready: boolean;
    checks: { mongo: string; redis: string };
    uptimeSeconds: number;
  }>("/v1/admin/system/health");
}
