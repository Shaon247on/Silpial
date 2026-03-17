'use server';

import { revalidatePath } from 'next/cache';
import { createBackendClient } from '@/lib/http/backend.client';
import type { ApiDocument } from '@/types/Document.type';

const REVALIDATE = '/admin/legales';

export interface DocActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string>;
}

// ── helper: extract error message from axios error ────────────────────────────

function extractError(err: unknown): { error: string; fieldErrors?: Record<string, string> } {
  const ax = err as { response?: { data?: Record<string, unknown> } };
  const data = ax?.response?.data;
  if (!data) return { error: err instanceof Error ? err.message : 'Error inesperado.' };

  // Field-level errors (e.g. { pdf_file: ["..."], title: ["..."] })
  const fieldErrors: Record<string, string> = {};
  for (const [key, val] of Object.entries(data)) {
    if (Array.isArray(val)) fieldErrors[key] = val[0] as string;
    else if (typeof val === 'string') fieldErrors[key] = val;
  }

  const topMessage = (data.detail as string) ?? Object.values(fieldErrors)[0] ?? 'Error inesperado.';
  return { error: topMessage, fieldErrors };
}

// ── Create document (multipart) ───────────────────────────────────────────────

export async function createDocumentAction(
  formData: FormData
): Promise<DocActionResult<ApiDocument>> {
  try {
    const api = await createBackendClient();
    const res = await api.post<ApiDocument>('/api/v1/document/documents/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    revalidatePath(REVALIDATE);
    return { success: true, data: res.data };
  } catch (err) {
    const { error, fieldErrors } = extractError(err);
    return { success: false, error, fieldErrors };
  }
}

// ── Update document (multipart PATCH) ────────────────────────────────────────

export async function updateDocumentAction(
  id: string,
  formData: FormData
): Promise<DocActionResult<ApiDocument>> {
  try {
    const api = await createBackendClient();
    const res = await api.patch<ApiDocument>(
      `/api/v1/document/documents/${id}/`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    revalidatePath(REVALIDATE);
    revalidatePath(`${REVALIDATE}/${id}`);
    return { success: true, data: res.data };
  } catch (err) {
    const { error, fieldErrors } = extractError(err);
    return { success: false, error, fieldErrors };
  }
}

// ── Delete document ───────────────────────────────────────────────────────────

export async function deleteDocumentAction(id: string): Promise<DocActionResult> {
  try {
    const api = await createBackendClient();
    await api.delete(`/api/v1/document/documents/${id}/`);
    revalidatePath(REVALIDATE);
    na
    return { success: true };
  } catch (err) {
    const { error } = extractError(err);
    return { success: false, error };
  }
}