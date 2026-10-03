"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../actions";
import { clearToken } from "@/lib/api";
export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setBusy(true);
    setError("");

    try {
      await login(email, password);
      router.replace("/");
    } catch (error: unknown) {
      clearToken();

      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <section className="loginCard">
        <div className="brandMark">A</div>

        <p className="eyebrow">ALAP OPERATIONS</p>

        <h1>Admin console</h1>

        <p className="muted">Sign in to your admin account.</p>

        <form onSubmit={submit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>

          {error && <div className="error">{error}</div>}

          <button type="submit" disabled={busy}>
            {busy ? "Signing in…" : "Sign in securely"}
          </button>
        </form>
      </section>
    </>
  );
}
