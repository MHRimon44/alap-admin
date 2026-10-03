"use client";
import { useEffect, useState } from "react";
import BrandLogo from "@/components/brand-logo";
import { useRouter } from "next/navigation";
import { token, clearToken } from "@/lib/api";
import { validateSession } from "../actions";
export default function SessionGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authed, setAuthed] = useState(false);
  const router = useRouter();
  useEffect(() => {
    let cancelled = false;
    if (!token()) {
      router.replace("/login");
      return;
    }
    validateSession()
      .then(() => {
        if (!cancelled) setAuthed(true);
      })
      .catch(() => {
        if (!cancelled) {
          clearToken();
          router.replace("/login");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [router]);
  if (!authed)
    return (
      <div className="center">
        <BrandLogo size={64} />
        <div className="spinner" />
        <h2>Opening Alap Admin</h2>
      </div>
    );
  return children;
}
