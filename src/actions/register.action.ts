"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { env } from "@/lib/config/env";
import { COOKIE, cookieBaseOptions } from "@/lib/auth/cookies";

type RegisterResponse = {
  success: boolean;
  message: string;
  user: {
    id: string;
    email: string;
    is_admin: boolean;
  };
  verificationToken: string;
};

export type RegisterActionResult = {
  success: boolean;
  error?: string;
};

export async function registerAction(
  formData: FormData
): Promise<RegisterActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("password_confirm") ?? "");
  const fullName = String(formData.get("full_name") ?? "");


  console.log("full_name response", fullName)
  if (!email || !password || !passwordConfirm || !fullName) {
    return {
      success: false,
      error: "Todos los campos obligatorios deben completarse.",
    };
  }

  let data: RegisterResponse;

  try {
    const res = await axios.post<RegisterResponse>(
      `${env.BACKEND_BASE_URL}/auth/register/`,
      {
        full_name: fullName,
        email,
        password,
        password_confirm: passwordConfirm,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    console.log("API Response:",res.data)
    data = res.data;


    if (!data.success || !data.verificationToken) {
      console.log("API Response",data)
      return {
        success: false,
        error: data.message || "No se pudo completar el registro.",
      };
    }

    const store = await cookies();

    store.set({
      name: COOKIE.verification,
      value: data.verificationToken,
      ...cookieBaseOptions(),
      maxAge: 60 * 15,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data as
      | { message?: string; detail?: string }
      | undefined;
      console.log("error response:", responseData)

      return {
        success: false,
        error:
          responseData?.message ||
          responseData?.detail ||
          "No se pudo completar el registro.",
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Ocurrió un error inesperado.",
    };
  }

  redirect(`/otp-verification?email=${encodeURIComponent(data.user.email)}`);
}