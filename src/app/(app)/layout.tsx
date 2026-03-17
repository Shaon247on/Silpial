import DashboardLayout from "@/components/layout/Dashboardlayout";
import { requireAuth } from "@/lib/auth/guards";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();

  return (
    <DashboardLayout is_admin={session.user.is_admin}>
      {children}
    </DashboardLayout>
  );
}