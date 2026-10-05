"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/admin-header";
import {
  ArrowLeft,
  Ban,
  MessageCircle,
  MessagesSquare,
  ShieldCheck,
  KeyRound,
  Trash2,
  Wifi,
} from "lucide-react";
import { deleteUser, getUser, resetUserPassword, revokeSessions, updateStatus } from "../actions";
import type { AdminUserDetails } from "../types";
import { formatDate } from "@/utils/format-date";

export default function UserProfile({ id }: { id: string }) {
  const router = useRouter();
  const [details, setDetails] = useState<AdminUserDetails | null>(null);
  const [message, setMessage] = useState("Loading user…");
  const [busy, setBusy] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  async function reload() {
    setDetails(await getUser(id));
  }
  useEffect(() => {
    let cancelled = false;
    getUser(id)
      .then((result) => {
        if (!cancelled) setDetails(result);
      })
      .catch((error: unknown) => {
        if (!cancelled)
          setMessage(
            error instanceof Error ? error.message : "Failed to load user",
          );
      });
    return () => {
      cancelled = true;
    };
  }, [id]);
  if (!details)
    return (
      <>
        <Header title="User profile" sub="Account details and controls" />
        <section className="panel">
          <p className="muted">{message}</p>
        </section>
      </>
    );
  const { user, stats, sessions } = details;
  async function changeStatus() {
    setBusy(true);
    try {
      await updateStatus(id, user.status === "active" ? "disabled" : "active");
      await reload();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Action failed");
    } finally {
      setBusy(false);
    }
  }
  async function revoke() {
    if (!window.confirm(`Sign out ${user.displayName} from every device?`))
      return;
    setBusy(true);
    try {
      const result = await revokeSessions(id);
      window.alert(`Revoked ${result.revoked} session(s).`);
      await reload();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Action failed");
    } finally {
      setBusy(false);
    }
  }
  async function resetPassword() {
    if (newPassword.length < 6) {
      window.alert("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      window.alert("Passwords do not match.");
      return;
    }
    if (!window.confirm(`Reset password for ${user.displayName}? All active sessions will be revoked.`)) return;
    setBusy(true);
    try {
      const result = await resetUserPassword(id, newPassword);
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordReset(false);
      window.alert(`Password changed. Revoked ${result.revoked} active session(s).`);
      await reload();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Password reset failed");
    } finally {
      setBusy(false);
    }
  }
  async function remove() {
    const first = window.confirm(
      `Permanently delete ${user.displayName}'s account? This removes the account, authentication sessions and user-specific state. This cannot be undone.`,
    );
    if (!first) return;
    const typed = window.prompt(
      `Type DELETE to confirm permanent deletion of ${user.email}`,
    );
    if (typed !== "DELETE") return;
    setBusy(true);
    try {
      await deleteUser(id);
      router.replace("/users");
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Delete failed");
      setBusy(false);
    }
  }
  return (
    <>
      <Header
        title={user.displayName}
        sub={user.email}
        actions={
          <button
            type="button"
            className="backButton"
            onClick={() => router.push("/users")}
          >
            <ArrowLeft /> Back to users
          </button>
        }
      />
      <div className="profileGrid">
        <section className="panel profileCard">
          <div className="profileTitle">
            <div className="avatar">
              {user.displayName.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <h2>{user.displayName}</h2>
              <p className="muted">@{user.username ?? "No username"}</p>
            </div>
            <span className={`pill ${user.status}`}>{user.status}</span>
          </div>
          <div className="detailList">
            <p>
              <b>Bio</b>
              <span>{user.bio || "—"}</span>
            </p>
            <p>
              <b>Presence</b>
              <span>{user.presenceVisibility}</span>
            </p>
            <p>
              <b>Joined</b>
              <span>{formatDate(user.createdAt)}</span>
            </p>
            <p>
              <b>Last seen</b>
              <span>{user.lastSeenAt ? formatDate(user.lastSeenAt) : "—"}</span>
            </p>
          </div>
        </section>
        <section className="panel">
          <h2>Account controls</h2>
          <p className="muted">
            Administrative actions are written to the audit log.
          </p>
          <div className="stackActions">
            <button
              type="button"
              className="secondary"
              disabled={busy}
              onClick={() => setShowPasswordReset((value) => !value)}
            >
              <KeyRound /> Change user password
            </button>
            {showPasswordReset && (
              <div className="passwordBox">
                <input
                  type="password"
                  autoComplete="new-password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  disabled={busy}
                />
                <input
                  type="password"
                  autoComplete="new-password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  disabled={busy}
                />
                <button type="button" className="primary" disabled={busy} onClick={() => void resetPassword()}>
                  Reset password
                </button>
                <p className="muted">The user will be signed out from all devices.</p>
              </div>
            )}
            <button
              type="button"
              className="secondary"
              disabled={busy}
              onClick={() => void revoke()}
            >
              <Wifi /> Revoke all sessions
            </button>
            <button
              type="button"
              className="danger"
              disabled={busy}
              onClick={() => void changeStatus()}
            >
              <Ban />{" "}
              {user.status === "active" ? "Disable account" : "Enable account"}
            </button>
            <button
              type="button"
              className="deleteButton"
              disabled={busy}
              onClick={() => void remove()}
            >
              <Trash2 /> Delete account permanently
            </button>
          </div>
        </section>
      </div>
      <div className="grid userStats">
        <Stat
          label="Active sessions"
          value={stats.activeSessions}
          icon={<Wifi />}
        />
        <Stat
          label="Conversations"
          value={stats.conversations}
          icon={<MessagesSquare />}
        />
        <Stat
          label="Messages sent"
          value={stats.messagesSent}
          icon={<MessageCircle />}
        />
        <Stat
          label="Reactions"
          value={stats.reactions}
          icon={<ShieldCheck />}
        />
      </div>
      <section className="panel">
        <h2>Recent sessions</h2>
        <div className="tableWrap innerTable">
          <table>
            <thead>
              <tr>
                <th>Device</th>
                <th>Platform</th>
                <th>App version</th>
                <th>Last used</th>
                <th>Expires</th>
                <th>State</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id}>
                  <td>{session.deviceName ?? "Unknown"}</td>
                  <td>{session.platform ?? "unknown"}</td>
                  <td>{session.appVersion ?? "—"}</td>
                  <td>{formatDate(session.lastUsedAt)}</td>
                  <td>{formatDate(session.expiresAt)}</td>
                  <td>
                    {session.revokedAt ? (
                      <span className="pill disabled">Revoked</span>
                    ) : (
                      <span className="pill active">Active</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sessions.length === 0 && (
            <div className="empty">No sessions found.</div>
          )}
        </div>
      </section>
    </>
  );
}
function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <article className="metric">
      <div className="metricIcon">{icon}</div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </article>
  );
}
