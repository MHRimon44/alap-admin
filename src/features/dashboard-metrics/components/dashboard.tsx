"use client";
import { useEffect, useState } from "react";
import Header from "@/components/layout/admin-header";
import {
  Activity,
  Ban,
  MessageCircle,
  MessagesSquare,
  SmilePlus,
  UserPlus,
  Users,
  Wifi,
  type LucideIcon,
} from "lucide-react";
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
        if (!cancelled) setDashboard(result);
      })
      .catch((error: unknown) => {
        if (!cancelled)
          setError(
            error instanceof Error ? error.message : "Failed to load dashboard",
          );
      });
    return () => {
      cancelled = true;
    };
  }, []);
  const metrics: Metric[] = [
    { label: "Total users", value: dashboard?.totalUsers, icon: Users },
    { label: "Active users", value: dashboard?.activeUsers, icon: Activity },
    { label: "Disabled users", value: dashboard?.disabledUsers, icon: Ban },
    { label: "New today", value: dashboard?.newUsersToday, icon: UserPlus },
    { label: "Active sessions", value: dashboard?.activeSessions, icon: Wifi },
    {
      label: "Conversations",
      value: dashboard?.conversations,
      icon: MessagesSquare,
    },
    { label: "Messages", value: dashboard?.messages, icon: MessageCircle },
    { label: "Reactions", value: dashboard?.reactions, icon: SmilePlus },
  ];
  return (
    <>
      <Header
        title="Dashboard"
        sub="Platform activity and account operations at a glance."
      />
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
      <section className="panel">
        <h2>Privacy-safe administration</h2>
        <p className="muted">
          The console exposes operational counts and account controls, not
          private message text. Destructive actions are protected by explicit
          confirmation and recorded in the admin audit log.
        </p>
      </section>
    </>
  );
}
