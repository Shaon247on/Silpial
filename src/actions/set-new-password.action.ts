"use server";

import axios from "axios";
import { cookies } from "next/headers";

import { env } from "@/lib/config/env";
import { COOKIE } from "@/lib/auth/cookies";

type SetNewPasswordResponse = {
  success: boolean;
  message: string;
};

export type SetNewPasswordActionResult = {
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

export async function setNewPasswordAction(
  formData: FormData
): Promise<SetNewPasswordActionResult> {
  const newPassword = String(formData.get("new_password") ?? "").trim();

  if (!newPassword) {
    return {
      success: false,
      error: "New password is required.",
    };
  }

  const store = await cookies();
  const passwordResetVerified = store.get(COOKIE.passwordResetVerified)?.value;

  if (!passwordResetVerified) {
    return {
      success: false,
      error: "Your reset session has expired. Please restart the forgot password process.",
    };
  }

  try {
    const res = await axios.post<SetNewPasswordResponse>(
      `${env.BACKEND_BASE_URL}/auth/forgot-password/set/`,
      {
        passwordResetVerified,
        new_password: newPassword,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    const data = res.data;

    if (!data.success) {
      return {
        success: false,
        error: data.message || "Failed to reset password.",
      };
    }

    store.delete(COOKIE.passwordResetVerified);

    return {
      success: true,
      redirectTo: "/login",
    };
  } catch (error) {
    return {
      success: false,
      error: extractAxiosError(error, "Failed to reset password."),
    };
  }
}