import SessionGuard from "@/features/auth/components/session-guard";
import Sidebar from "@/components/layout/sidebar";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionGuard>
      <div className="shell">
        <Sidebar />
        <main className="main">
          <div className="pageTemplate">{children}</div>
        </main>
      </div>
    </SessionGuard>
  );
}
