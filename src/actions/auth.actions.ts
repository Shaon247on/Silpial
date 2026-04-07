"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import axios from "axios";
import { env } from "@/lib/config/env";
import { COOKIE, cookieBaseOptions } from "@/lib/auth/cookies";
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

type BackendErrorResponse = {
  error?: string;
};

type LoginActionResult =
  | { success: true }
  | { success: false; message: string };

function secondsUntil(msEpoch: number): number {
  return Math.max(0, Math.floor((msEpoch - Date.now()) / 1000));
}

export async function loginAction(formData: FormData): Promise<LoginActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return {
      success: false,
      message: "Email and password are required.",
    };
  }

  try {
    const res = await axios.post<LoginResponse>(
      `${env.BACKEND_BASE_URL}${env.BACKEND_LOGIN_PATH}`,
      { email, password },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 15_000,
      }
    );

    const { access, refresh, user } = res.data;
    const store = await cookies();

    const accessExpMs = getJwtExpMs(access);
    const accessMaxAge = accessExpMs ? secondsUntil(accessExpMs) : 60 * 10;

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

    const sessionJwt = await signSession(
      { user: sessionUser },
      Math.min(refreshMaxAge, 60 * 60 * 24 * 14)
    );

    store.set({
      name: COOKIE.session,
      value: sessionJwt,
      ...cookieBaseOptions(),
      maxAge: Math.min(refreshMaxAge, 60 * 60 * 24 * 14),
    });

    redirect(sessionUser.is_admin ? "/admin" : "/dashboard");
  } catch (error) {
    if (axios.isAxiosError<BackendErrorResponse>(error)) {
      const message =
        error.response?.data?.error ||
        "Unable to sign in. Please check your credentials.";

      return {
        success: false,
        message,
      };
    }

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(COOKIE.access);
  store.delete(COOKIE.refresh);
  store.delete(COOKIE.session);
  redirect("/");
}