"use server";

import { refresh, revalidatePath } from "next/cache";
import { createBackendClient } from "@/lib/http/backend.client";
import type {
  UpdateProfileResponse,
  UpdatePasswordResponse,
} from "@/types/profile.type";
import { cookies } from "next/headers";
import { COOKIE, cookieBaseOptions } from "@/lib/auth/cookies";
import { SessionUser, signSession, verifySession } from "@/lib/auth/session";



type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function updateProfileAction(
  formData: FormData,
): Promise<ActionResult<UpdateProfileResponse["user"]>> {
  try {
    const api = await createBackendClient();

    const res = await api.patch<UpdateProfileResponse>(
      "/auth/update-profile/",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );

    const updatedUser = res.data.user;
    const store = await cookies();

    const currentSessionToken = store.get(COOKIE.session)?.value;

    if (currentSessionToken) {
      const currentSession = await verifySession(currentSessionToken);

      if (currentSession?.user) {
        const nextSessionUser: SessionUser = {
          ...currentSession.user,
          id: updatedUser.id,
          email: updatedUser.email,
          full_name: updatedUser.full_name ?? "",
          is_admin: !!updatedUser.is_admin,
          profile_pic: updatedUser.profile_pic ?? "",
        };

        const sessionMaxAge = 60 * 60 * 24 * 14;

        const nextSessionToken = await signSession(
          { user: nextSessionUser },
          sessionMaxAge,
        );

        store.set({
          name: COOKIE.session,
          value: nextSessionToken,
          ...cookieBaseOptions(),
          maxAge: sessionMaxAge,
        });
      }
    }

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");
    revalidatePath("/admin");

    return { success: true, data: updatedUser };
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
