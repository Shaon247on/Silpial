'use server';

import { revalidatePath } from 'next/cache';
import { createBackendClient } from '@/lib/http/backend.client';

export async function toggleBlockUserAction(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const api = await createBackendClient();

    await api.post(`/api/v1/admin/users/${userId}/block_unblock/`);

    revalidatePath('/admin/usuarios');

    return { success: true };
  } catch (err: unknown) {
    console.error('toggleBlockUserAction error:', err);

    const message =
      err instanceof Error ? err.message : 'Error al actualizar el estado del usuario.';

    return { success: false, error: message };
  }
}