import { cookies } from "next/headers";
import OTPVerificationPage from "@/components/auth/OTPVerification";
import { COOKIE } from "@/lib/auth/cookies";

export default async function Page() {
  const store = await cookies();

  const hasPassResetToken = !!store.get(COOKIE.passReset)?.value;

  const mode: "signup" | "forgot-password" = hasPassResetToken
    ? "forgot-password"
    : "signup";

  return <OTPVerificationPage mode={mode} />;
}