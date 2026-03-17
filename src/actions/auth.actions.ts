"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import axios from "axios";
import { env } from "@/lib/config/env";
import { COOKIE, cookieBaseOptions, isProd } from "@/lib/auth/cookies";
import { getJwtExpMs } from "@/lib/auth/jwt";
import { signSession, type SessionUser } from "@/lib/auth/session";

type LoginResponse = {
  success: true;
  access: string;
  refresh: string;
  user: {
    id: string;
    email: string;
    full_name: string;
    is_admin: boolean;
  };
};

function secondsUntil(msEpoch: number): number {
  return Math.max(0, Math.floor((msEpoch - Date.now()) / 1000));
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    // In production you might return structured errors and render them in UI
    throw new Error("Missing credentials");
  }

  const res = await axios.post<LoginResponse>(
    `${env.BACKEND_BASE_URL}${env.BACKEND_LOGIN_PATH}`,
    { email, password },
    { headers: { "Content-Type": "application/json" }, timeout: 15_000 },
  );

  console.log("user details:🟢", res.data);
  const { access, refresh, user } = res.data;
  const store = await cookies();

  // Access cookie expiry aligned to JWT exp when available
  const accessExpMs = getJwtExpMs(access);
  const accessMaxAge = accessExpMs ? secondsUntil(accessExpMs) : 60 * 10;

  // Refresh cookie: set a conservative TTL unless your backend returns exp
  // If refresh token is a JWT, you can parse it similarly.
  const refreshExpMs = getJwtExpMs(refresh);
  const refreshMaxAge = refreshExpMs
    ? secondsUntil(refreshExpMs)
    : 60 * 60 * 24 * 14;

  store.set({
    name: COOKIE.access,
    value: access,
    ...cookieBaseOptions(),
    maxAge: accessMaxAge,
  });

  store.set({
    name: COOKIE.refresh,
    value: refresh,
    ...cookieBaseOptions(),
    maxAge: refreshMaxAge,
  });

  const sessionUser: SessionUser = {
    id: user.id,
    email: user.email,
    full_name: user.full_name ?? "",
    is_admin: !!user.is_admin,
  };

  // Session cookie TTL should be <= refresh TTL to avoid orphaned sessions
  const sessionJwt = await signSession(
    { user: sessionUser },
    Math.min(refreshMaxAge, 60 * 60 * 24 * 14),
  );

  store.set({
    name: COOKIE.session,
    value: sessionJwt,
    ...cookieBaseOptions(),
    maxAge: Math.min(refreshMaxAge, 60 * 60 * 24 * 14),
  });

  // User-based routing (RBAC)
  redirect(sessionUser.is_admin ? "/admin" : "/dashboard");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(COOKIE.access);
  store.delete(COOKIE.refresh);
  store.delete(COOKIE.session);
  redirect("/");
}
