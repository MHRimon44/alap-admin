"use client";
import { useEffect, useState } from "react";
import Header from "@/components/layout/admin-header";
import Link from "next/link";
import { Search, UserX } from "lucide-react";
import {
  getUsers,
  updateStatus,
  revokeSessions as revokeUserSessions,
} from "../actions";
import type { AdminUser } from "../types";
import { formatDate } from "@/utils/format-date";

export default function UsersPage() {
  const [items, setItems] = useState<AdminUser[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  async function load(searchQuery = query, statusFilter = status) {
    try {
      setError("");
      setItems((await getUsers(searchQuery, statusFilter)).items);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Failed to load users");
    }
  }
  useEffect(() => {
    let cancelled = false;
    getUsers()
      .then((result) => {
        if (!cancelled) setItems(result.items);
      })
      .catch((error: unknown) => {
        if (!cancelled)
          setError(
            error instanceof Error ? error.message : "Failed to load users",
          );
      });
    return () => {
      cancelled = true;
    };
  }, []);
  async function changeStatus(user: AdminUser) {
    setBusy(user.id);
    setError("");
    try {
      await updateStatus(
        user.id,
        user.status === "active" ? "disabled" : "active",
      );
      await load();
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Failed to update user status",
      );
    } finally {
      setBusy("");
    }
  }
  async function revokeSessions(user: AdminUser) {
    if (!window.confirm(`Sign out ${user.displayName} from all devices?`))
      return;
    setBusy(user.id);
    setError("");
    try {
      const result = await revokeUserSessions(user.id);
      window.alert(`Revoked ${result.revoked} session(s).`);
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Failed to revoke sessions",
      );
    } finally {
      setBusy("");
    }
  }
  return (
    <>
      <Header
        title="Users"
        sub="Search accounts, filter access state, inspect profiles and control sessions."
      />
      <div className="toolbar">
        <div className="search">
          <Search />
          <input
            placeholder="Search email, name or username"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void load();
            }}
          />
        </div>
        <select
          value={status}
          onChange={(e) => {
            const value = e.target.value;
            setStatus(value);
            void load(query, value);
          }}
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="disabled">Disabled</option>
        </select>
        <button type="button" onClick={() => void load()}>
          Search
        </button>
      </div>
      {error && <div className="error">{error}</div>}
      <section className="tableWrap">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Status</th>
              <th>Last seen</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((user) => (
              <tr key={user.id}>
                <td>
                  <b>
                    <Link href={`/users/${encodeURIComponent(user.id)}`}>
                      {user.displayName}
                    </Link>
                  </b>
                  <small>@{user.username ?? "—"}</small>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`pill ${user.status}`}>{user.status}</span>
                </td>
                <td>{user.lastSeenAt ? formatDate(user.lastSeenAt) : "—"}</td>
                <td>{formatDate(user.createdAt)}</td>
                <td>
                  <div className="actions">
                    <button
                      type="button"
                      className="secondary"
                      disabled={busy === user.id}
                      onClick={() => void revokeSessions(user)}
                    >
                      Revoke sessions
                    </button>
                    <button
                      type="button"
                      className={
                        user.status === "active" ? "danger" : "secondary"
                      }
                      disabled={busy === user.id}
                      onClick={() => void changeStatus(user)}
                    >
                      {user.status === "active" ? (
                        <>
                          <UserX />
                          Disable
                        </>
                      ) : (
                        <>Enable</>
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <div className="empty">No users found.</div>}
      </section>
    </>
  );
}
