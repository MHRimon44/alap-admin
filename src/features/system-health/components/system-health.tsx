"use client";
import { useEffect, useState } from "react";
import Header from "@/components/layout/admin-header";
import { Activity } from "lucide-react";
import { getSystemHealth } from "../actions";
export default function System() {
  const [health, setHealth] = useState<Awaited<
    ReturnType<typeof getSystemHealth>
  > | null>(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  async function refreshHealth() {
    setLoading(true);
    try {
      setError("");

      const result = await getSystemHealth();
      setHealth(result);
      setLastChecked(new Date());
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Failed to load system health",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    getSystemHealth()
      .then((result) => {
        if (!cancelled) {
          setHealth(result);
          setLastChecked(new Date());
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to load system health",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Header
        title="System health"
        sub="Read-only health information from the Alap API."
      />

      <div className="grid">
        <Health label="API" ok={health ? Boolean(health.ready) : null} />

        <Health label="MongoDB" ok={health ? health.checks.mongo === "up" : null} />

        <Health label="Redis" ok={health ? health.checks.redis === "up" : null} />
      </div>

      <section className="panel" aria-busy={loading}>
        <h2>Runtime</h2>

        <p>
          Uptime:{" "}
          <b>
            {health
              ? `${Math.floor(health.uptimeSeconds / 60)} minutes ${Math.floor(health.uptimeSeconds % 60)} seconds`
              : "—"}
          </b>
        </p>

        <button type="button" disabled={loading} onClick={() => void refreshHealth()}>
          {loading ? "Refreshing…" : "Refresh health"}
        </button>

        <p className="muted healthRefreshStatus" role="status" aria-live="polite">
          {loading
            ? "Checking system health…"
            : error
              ? "Health check failed. Try refreshing again."
              : lastChecked
                ? `Health updated at ${lastChecked.toLocaleTimeString()}.`
                : ""}
        </p>
        {error && <div className="error" role="alert">{error}</div>}
      </section>
    </>
  );
}

function Health({ label, ok }: { label: string; ok: boolean | null }) {
  return (
    <article className="metric">
      <div className="metricIcon">
        <Activity />
      </div>

      <div>
        <span>{label}</span>

        <strong className={ok === null ? "muted" : ok ? "ok" : "bad"}>
          {ok === null ? "—" : ok ? "Healthy" : "Unavailable"}
        </strong>
      </div>
    </article>
  );
}
