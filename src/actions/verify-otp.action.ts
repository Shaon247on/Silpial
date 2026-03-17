"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { env } from "@/lib/config/env";
import { COOKIE } from "@/lib/auth/cookies";

type VerifyOtpResponse = {
  success: boolean;
  message: string;
};

export type VerifyOtpActionResult = {
  success: boolean;
  error?: string;
};

export async function verifyOtpAction(
  formData: FormData
): Promise<VerifyOtpActionResult> {
  const otp = String(formData.get("otp") ?? "").trim();

  if (!otp || otp.length !== 6) {
    return {
      success: false,
      error: "Por favor ingresa el código de 6 dígitos.",
    };
  }

  const store = await cookies();
  const verificationToken = store.get(COOKIE.verification)?.value;

  if (!verificationToken) {
    return {
      success: false,
      error: "La sesión de verificación expiró. Solicita un nuevo código.",
    };
  }

  try {
    const res = await axios.post<VerifyOtpResponse>(
      `${env.BACKEND_BASE_URL}/auth/verify-otp/`,
      {
        otp,
        verificationToken,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    if (!res.data.success) {
      return {
        success: false,
        error: res.data.message || "No se pudo verificar el código.",
      };
    }

    store.delete(COOKIE.verification);
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
        error: "No se pudo verificar el código.",
      };
    }

    return {
      success: false,
      error: "Ocurrió un error inesperado.",
    };
  }

  redirect("/login");
}