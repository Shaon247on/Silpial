"use server";

import axios from "axios";
import { cookies } from "next/headers";

import { env } from "@/lib/config/env";
import { COOKIE, cookieBaseOptions } from "@/lib/auth/cookies";

type VerifyForgotPasswordOtpResponse = {
  success: boolean;
  message: string;
  passwordResetVerified: string;
};

export type ForgetVerifyOtpActionResult = {
  success: boolean;
  error?: string;
  redirectTo?: string;
};

function extractAxiosError(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; detail?: string }
      | Record<string, string[]>
      | undefined;

    if (data && typeof data === "object") {
      if ("message" in data && typeof data.message === "string") {
        return data.message;
      }

      if ("detail" in data && typeof data.detail === "string") {
        return data.detail;
      }

      const firstFieldError = Object.values(data).find(
        (value) => Array.isArray(value) && typeof value[0] === "string"
      );

      if (firstFieldError && Array.isArray(firstFieldError)) {
        return firstFieldError[0];
      }
    }
  }

  return fallback;
}

export async function forgetVerifyOtpAction(
  formData: FormData
): Promise<ForgetVerifyOtpActionResult> {
  const otp = String(formData.get("otp") ?? "").trim();

  if (!otp || otp.length !== 6) {
    return {
      success: false,
      error: "Por favor ingresa el código de 6 dígitos.",
    };
  }

  const store = await cookies();
  const passResetToken = store.get(COOKIE.passReset)?.value;

  if (!passResetToken) {
    return {
      success: false,
      error: "La sesión de recuperación expiró. Solicita un nuevo código.",
    };
  }

  try {
    const res = await axios.post<VerifyForgotPasswordOtpResponse>(
      `${env.BACKEND_BASE_URL}/auth/forgot-password/verify-otp/`,
      {
        passResetToken,
        otp,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    const data = res.data;

    if (!data.success || !data.passwordResetVerified) {
      return {
        success: false,
        error: data.message || "No se pudo verificar el código.",
      };
    }

    store.set({
      name: COOKIE.passwordResetVerified,
      value: data.passwordResetVerified,
      ...cookieBaseOptions(),
      maxAge: 60 * 10,
    });

    store.delete(COOKIE.passReset);

    return {
      success: true,
      redirectTo: "/new-password",
    };
  } catch (error) {
    return {
      success: false,
      error: extractAxiosError(error, "No se pudo verificar el código."),
    };
  }
}