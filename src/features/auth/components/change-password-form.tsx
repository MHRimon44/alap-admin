"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/admin-header";
import { changePassword } from "../actions";

export default function ChangePasswordForm() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (newPassword.length < 6) return setError("New password must be at least 6 characters.");
    if (newPassword !== confirmPassword) return setError("New passwords do not match.");
    setBusy(true);
    try {
      await changePassword(currentPassword, newPassword);
      window.alert("Password changed successfully. Please sign in again.");
      router.replace("/login");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not change password.");
      setBusy(false);
    }
  }

  return (
    <>
      <Header title="Security" sub="Manage your administrator password" />
      <section className="panel securityPanel">
        <h2>Change password</h2>
        <p className="muted">Changing your password signs your account out on every device.</p>
        <form className="passwordForm" onSubmit={(event) => void submit(event)}>
          <label>Current password<input type="password" autoComplete="current-password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required /></label>
          <label>New password<input type="password" autoComplete="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={6} maxLength={128} required /></label>
          <label>Confirm new password<input type="password" autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required /></label>
          {error && <p className="formError">{error}</p>}
          <button type="submit" className="primary" disabled={busy}>{busy ? "Changing…" : "Change password"}</button>
        </form>
      </section>
    </>
  );
}
