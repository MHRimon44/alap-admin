"use client";
import { useEffect, useState } from "react";
import Header from "@/components/layout/admin-header";
import { Users, Zap, Shield, Wifi, type LucideIcon } from "lucide-react";
import { getDashboardMetrics } from "../actions";
type Metric = { label: string; value: number | undefined; icon: LucideIcon };
export default function Dashboard() {
  const [dashboard, setDashboard] = useState<Awaited<
    ReturnType<typeof getDashboardMetrics>
  > | null>(null);

  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    getDashboardMetrics()
      .then((result) => {
        if (!cancelled) {
          setDashboard(result);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setError(
            error instanceof Error ? error.message : "Failed to load dashboard",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const metrics: Metric[] = [
    {
      label: "Total users",
      value: dashboard?.totalUsers,
      icon: Users,
    },
    {
      label: "Active users",
      value: dashboard?.activeUsers,
      icon: Zap,
    },
    {
      label: "New today",
      value: dashboard?.newUsersToday,
      icon: Shield,
    },
    {
      label: "Active sessions",
      value: dashboard?.activeSessions,
      icon: Wifi,
    },
  ];

  return (
    <>
      <Header title="Dashboard" sub="A live view of your Alap community." />

      <div className="grid">
        {metrics.map(({ label, value, icon: Icon }) => (
          <article className="metric" key={label}>
            <div className="metricIcon">
              <Icon />
            </div>

            <div>
              <span>{label}</span>
              <strong>{value ?? "—"}</strong>
            </div>
          </article>
        ))}
      </div>

      {error && <div className="error">{error}</div>}


    </>
  );
}
