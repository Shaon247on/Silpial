"use server";

import { refresh, revalidatePath } from "next/cache";
import { createBackendClient } from "@/lib/http/backend.client";
import type {
  UpdateProfileResponse,
  UpdatePasswordResponse,
} from "@/types/profile.type";
import { cookies } from "next/headers";
import { COOKIE } from "@/lib/auth/cookies";

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

// ── Update profile (multipart) ─────────────────────────────────────────────────

export async function updateProfileAction(
  formData: FormData,
): Promise<ActionResult<UpdateProfileResponse["user"]>> {
  try {
    const store = await cookies();
    const api = await createBackendClient();
    const res = await api.patch<UpdateProfileResponse>(
      "/auth/update-profile/",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    store.set("dev_access", res.data.access);
    revalidatePath("/dashboard/settings");
    return { success: true, data: res.data.user };
  } catch (err: unknown) {
    const ax = err as {
      response?: { data?: { detail?: string; message?: string } };
    };
    const msg =
      ax?.response?.data?.detail ??
      ax?.response?.data?.message ??
      (err instanceof Error ? err.message : "Failed to update profile.");
    return { success: false, error: msg };
  }
}

// ── Update password ────────────────────────────────────────────────────────────

export async function updatePasswordAction(
  currentPassword: string,
  newPassword: string,
): Promise<ActionResult> {
  try {
    const api = await createBackendClient();
    await api.post<UpdatePasswordResponse>("/auth/update-password/", {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return { success: true };
  } catch (err: unknown) {
    const ax = err as {
      response?: {
        data?: {
          detail?: string;
          message?: string;
          current_password?: string[];
        };
      };
    };
    const msg =
      ax?.response?.data?.current_password?.[0] ??
      ax?.response?.data?.detail ??
      ax?.response?.data?.message ??
      (err instanceof Error ? err.message : "Failed to update password.");
    return { success: false, error: msg };
  }
}
