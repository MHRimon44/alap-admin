"use client";
import { useEffect, useState } from "react";
import Header from "@/components/layout/admin-header";
import { getAuditLog, type AuditItem } from "../actions";
import { formatDate } from "@/utils/format-date";
const labels: Record<AuditItem["action"], string> = {
  "user.status_changed": "User status changed",
  "user.sessions_revoked": "Sessions revoked",
  "user.password_reset": "User password reset",
  "user.deleted": "User deleted",
};
export default function AuditLog() {
  const [items, setItems] = useState<AuditItem[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    let cancelled = false;
    getAuditLog()
      .then((result) => {
        if (!cancelled) setItems(result);
      })
      .catch((error: unknown) => {
        if (!cancelled)
          setError(
            error instanceof Error ? error.message : "Failed to load audit log",
          );
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return (
    <>
      <Header
        title="Audit log"
        sub="A trace of destructive and security-sensitive administrator actions."
      />
      {error && <div className="error">{error}</div>}
      <section className="tableWrap">
        <table>
          <thead>
            <tr>
              <th>Action</th>
              <th>Target user</th>
              <th>Admin actor</th>
              <th>Details</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <b>{labels[item.action]}</b>
                </td>
                <td>{item.targetUserId ?? "—"}</td>
                <td>{item.actorId}</td>
                <td>
                  <code>{JSON.stringify(item.metadata)}</code>
                </td>
                <td>{formatDate(item.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <div className="empty">No admin actions recorded yet.</div>
        )}
      </section>
    </>
  );
}
