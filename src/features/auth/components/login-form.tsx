"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import BrandLogo from "@/components/brand-logo";
import { useRouter } from "next/navigation";
import { login } from "../actions";
import { clearToken } from "@/lib/api";
export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
        <BrandLogo size={64} className="brandMark" />

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

          <div className="passwordField">
            <label htmlFor="password">Password</label>
            <div className="passwordInput">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="passwordToggle"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-controls="password"
                onClick={() => setShowPassword((visible) => !visible)}
              >
                {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
              </button>
            </div>
          </div>

          {error && <div className="error">{error}</div>}

          <button type="submit" disabled={busy}>
            {busy ? "Signing in…" : "Sign in securely"}
          </button>
        </form>
      </section>
    </>
  );
}
