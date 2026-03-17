'use server';

import { revalidatePath } from 'next/cache';
import { createBackendClient } from '@/lib/http/backend.client';
import { Category } from '@/types/category.type';

const BASE = '/api/v1/document/categories';
const REVALIDATE = '/admin/categorias';

// ── Types ─────────────────────────────────────────────────────────────────────



export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

// ── Create ────────────────────────────────────────────────────────────────────

export async function createCategoryAction(
  name: string
): Promise<ActionResult<Category>> {
  try {
    const api = await createBackendClient();
    const res = await api.post<Category>(BASE + '/', { name });
    revalidatePath(REVALIDATE);
    return { success: true, data: res.data };
  } catch (err: unknown) {
    const axiosError = err as { response?: { data?: { name?: string[] } } };
    const msg =
      axiosError?.response?.data?.name?.[0] ??
      (err instanceof Error ? err.message : 'Error al crear la categoría.');
    return { success: false, error: msg };
  }
}

// ── Update ────────────────────────────────────────────────────────────────────

export async function updateCategoryAction(
  id: string,
  name: string
): Promise<ActionResult<Category>> {
  try {
    const api = await createBackendClient();
    const res = await api.patch<Category>(`${BASE}/${id}/`, { name });
    revalidatePath(REVALIDATE);
    return { success: true, data: res.data };
  } catch (err: unknown) {
    const axiosError = err as { response?: { data?: { detail?: string; name?: string[] } } };
    const msg =
      axiosError?.response?.data?.detail ??
      axiosError?.response?.data?.name?.[0] ??
      (err instanceof Error ? err.message : 'Error al actualizar la categoría.');
    return { success: false, error: msg };
  }
}

// ── Delete ────────────────────────────────────────────────────────────────────

export async function deleteCategoryAction(
  id: string
): Promise<ActionResult> {
  try {
    const api = await createBackendClient();
    await api.delete(`${BASE}/${id}/`);
    revalidatePath(REVALIDATE);
    return { success: true };
  } catch (err: unknown) {
    const axiosError = err as { response?: { data?: { detail?: string } } };
    const msg =
      axiosError?.response?.data?.detail ??
      (err instanceof Error ? err.message : 'Error al eliminar la categoría.');
    return { success: false, error: msg };
  }
}