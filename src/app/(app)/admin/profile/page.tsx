import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "@/lib/config/env";
import { COOKIE } from "@/lib/auth/cookies";
import type { UserProfile } from "@/types/profile.type";
import ProfileClient from "@/components/dashboard/profile/ProfileSetting";

// ── Fetch profile on the server ────────────────────────────────────────────────

async function fetchProfile(): Promise<UserProfile> {
  const store = await cookies();
  const token = store.get(COOKIE.access)?.value ?? "";

  const res = await fetch(`${env.BACKEND_BASE_URL}/auth/profile/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (res.status === 401) redirect("/login");
  if (!res.ok) throw new Error(`Failed to fetch profile: ${res.status}`);

  return res.json() as Promise<UserProfile>;
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function SettingsPage() {
  const profile = await fetchProfile();

  return (
    <div className="p-6">
      <ProfileClient profile={profile} />
    </div>
  );
}