"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  LayoutDashboard,
  LogOut,
  Users,
} from "lucide-react";
import { logout } from "@/features/auth/actions";
const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/users", label: "Users", icon: Users },
  { href: "/system", label: "System health", icon: Activity },
];
export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <aside>
      <div className="logo">
        <span>A</span>
        <div>
          <b>Alap</b>
          <small>Admin</small>
        </div>
      </div>
      <nav aria-label="Admin navigation">
        {links.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={active ? "nav active" : "nav"}
              aria-current={active ? "page" : undefined}
              aria-label={label}
              title={label}
            >
              <Icon />
              {label}
            </Link>
          );
        })}
      </nav>
      <button
        type="button"
        className="logout"
        aria-label="Sign out"
        onClick={() => {
          logout();
          router.replace("/login");
        }}
      >
        <LogOut />
        Sign out
      </button>
    </aside>
  );
}
