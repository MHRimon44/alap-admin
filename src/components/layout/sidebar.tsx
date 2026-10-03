"use client";
import Link from "next/link";
import BrandLogo from "@/components/brand-logo";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Users,
} from "lucide-react";
import { logout } from "@/features/auth/actions";
import { ThemeToggle } from "./theme-toggle";
const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/users", label: "Users", icon: Users },
  { href: "/audit", label: "Audit log", icon: ClipboardList },
  { href: "/system", label: "System health", icon: Activity },
];
export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <aside>
      <div className="logo">
        <BrandLogo />
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
            >
              <Icon />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="sidebarFooter">
        <ThemeToggle />
        <button
          type="button"
          className="logout"
          onClick={() => {
            logout();
            router.replace("/login");
          }}
        >
          <LogOut />
          Sign out
        </button>
      </div>
    </aside>
  );
}
