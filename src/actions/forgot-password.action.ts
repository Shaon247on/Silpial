"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { env } from "@/lib/config/env";
import { COOKIE, cookieBaseOptions } from "@/lib/auth/cookies";

type ForgotPasswordResponse = {
  success: boolean;
  message: string;
  user: {
    id: string;
    email: string;
    is_admin: boolean;
  };
  passResetToken: string;
};

export type ForgotPasswordActionResult = {
  success: boolean;
  error?: string;
};

export async function forgotPasswordAction(
  formData: FormData
): Promise<ForgotPasswordActionResult> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return {
      success: false,
      error: "Email is required.",
    };
  }

  let data: ForgotPasswordResponse;

  try {
    const res = await axios.post<ForgotPasswordResponse>(
      `${env.BACKEND_BASE_URL}/auth/forgot-password/`,
      { email },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    data = res.data;

    console.log("forget password response 🟢:", data);

    if (!data.success || !data.passResetToken) {
      return {
        success: false,
        error: data.message || "Failed to send password reset OTP.",
      };
    }

    const store = await cookies();

    store.set({
      name: COOKIE.passReset,
      value: data.passResetToken,
      ...cookieBaseOptions(),
      maxAge: 60 * 10,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data as
        | { message?: string; detail?: string }
        | Record<string, string[]>
        | undefined;

      if (data && typeof data === "object") {
        if ("message" in data && typeof data.message === "string") {
          return { success: false, error: data.message };
        }

        if ("detail" in data && typeof data.detail === "string") {
          return { success: false, error: data.detail };
        }

        const firstFieldError = Object.values(data).find(
          (value) => Array.isArray(value) && typeof value[0] === "string"
        );

        if (firstFieldError && Array.isArray(firstFieldError)) {
          return { success: false, error: firstFieldError[0] };
        }
      }

      return {
        success: false,
        error: "Failed to send password reset OTP.",
      };
    }

    return {
      success: false,
      error: "Unexpected error occurred.",
    };
  }

  redirect("/otp-verification");
}