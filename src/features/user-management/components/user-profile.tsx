"use client";
import { useEffect, useState } from "react";
import Header from "@/components/layout/admin-header";
import { getUsers } from "../actions";
import type { AdminUser } from "../types";
import { formatDate } from "@/utils/format-date";
export default function UserProfile({ id }: { id: string }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [message, setMessage] = useState("Loading user…");
  useEffect(() => {
    let cancelled = false;
    getUsers()
      .then(({ items }) => {
        if (!cancelled) {
          setUser(items.find((user) => user.id === id) ?? null);
          setMessage(
            "User could not be loaded from the account list.",
          );
        }
      })
      .catch((error) => {
        if (!cancelled)
          setMessage(
            error instanceof Error ? error.message : "Failed to load user",
          );
      });
    return () => {
      cancelled = true;
    };
  }, [id]);
  return (
    <>
      <Header title="User profile" sub="Account details" />
      <section className="panel">
        {user ? (
          <>
            <h2>{user.displayName}</h2>
            <p>{user.email}</p>
            <p>Status: {user.status}</p>
            <p>Joined: {formatDate(user.createdAt)}</p>
          </>
        ) : (
          <p className="muted">{message}</p>
        )}
      </section>
    </>
  );
}
