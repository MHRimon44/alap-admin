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

  async function refreshHealth() {
    try {
      setError("");

      const result = await getSystemHealth();
      setHealth(result);
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Failed to load system health",
      );
    }
  }

  useEffect(() => {
    let cancelled = false;

    getSystemHealth()
      .then((result) => {
        if (!cancelled) {
          setHealth(result);
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
        <Health label="API" ok={Boolean(health?.ready)} />

        <Health label="MongoDB" ok={health?.checks.mongo === "up"} />

        <Health label="Redis" ok={health?.checks.redis === "up"} />
      </div>

      <section className="panel">
        <h2>Runtime</h2>

        <p>
          Uptime:{" "}
          <b>
            {health ? `${Math.floor(health.uptimeSeconds / 60)} minutes` : "—"}
          </b>
        </p>

        <button type="button" onClick={() => void refreshHealth()}>
          Refresh health
        </button>

        {error && <div className="error">{error}</div>}
      </section>
    </>
  );
}

function Health({ label, ok }: { label: string; ok: boolean }) {
  return (
    <article className="metric">
      <div className="metricIcon">
        <Activity />
      </div>

      <div>
        <span>{label}</span>

        <strong className={ok ? "ok" : "bad"}>
          {ok ? "Healthy" : "Unavailable"}
        </strong>
      </div>
    </article>
  );
}
