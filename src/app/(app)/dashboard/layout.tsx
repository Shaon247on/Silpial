import { requireNonAdmin } from "@/lib/auth/guards";

export default async function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireNonAdmin();
  return children;
}