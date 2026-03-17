'use server';

import { createBackendClient } from '@/lib/http/backend.client';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AnalysisSection {
  section_id: string;
  section_name: string;
  section_text?: string;
  status: 'Issues detected' | 'Missing' | 'OK';
  review: string;
  suggested_changes?: string;
}

export interface AnalysisSummary {
  total_sections: number;
  flagged_sections: number;
  missing_sections: number;
  total_contradictions: number;
  compliance_score: number;
}

export interface AnalysisResult {
  summary: AnalysisSummary;
  sections: AnalysisSection[];
}

export interface AnalysisStep {
  name: string;
  description: string;
  status: 'complete' | 'pending' | 'in-progress';
  detail: string;
}

export interface LawUploadResult {
  file: string;
  status: 'success' | 'failed';
  reason: string;
  document_id: string;
  title: string;
  category: string;
  chunks: number;
  cloudinary_url: string;
  analysis_result: AnalysisResult;
  steps: AnalysisStep[];
}

export interface LawUploadResponse {
  total: number;
  success: number;
  skipped: number;
  failed: number;
  total_chunks: number;
  results: LawUploadResult[];
}

export interface LawUploadActionResult {
  success: boolean;
  data?: LawUploadResponse;
  error?: string;
  fieldErrors?: Record<string, string>;
}

// ── Helper ────────────────────────────────────────────────────────────────────

function extractError(err: unknown): { error: string; fieldErrors?: Record<string, string> } {
  const ax = err as { response?: { data?: Record<string, unknown> } };
  const data = ax?.response?.data;
  if (!data) return { error: err instanceof Error ? err.message : 'Error inesperado.' };

  const fieldErrors: Record<string, string> = {};
  for (const [key, val] of Object.entries(data)) {
    if (Array.isArray(val)) fieldErrors[key] = val[0] as string;
    else if (typeof val === 'string') fieldErrors[key] = val;
  }

  const topMessage =
    (data.detail as string) ?? Object.values(fieldErrors)[0] ?? 'Error inesperado.';
  return { error: topMessage, fieldErrors };
}

// ── List all uploaded documents ───────────────────────────────────────────────

/** Raw paginated response from GET /api/v1/document/law-upload/ */
export interface LawDocumentListResponse {
  count: number;
  user: string;
  total_uploads: number;
  next: string | null;
  previous: string | null;
  results: LawUploadResult[];
}

/** Normalised row shape consumed by DocumentsTable */
export interface DocumentRow {
  id: string;           // document_id
  name: string;         // title
  fileName: string;     // file
  sections: number;     // analysis_result.summary.total_sections
  complianceScore: number; // analysis_result.summary.compliance_score
  flaggedSections: number; // analysis_result.summary.flagged_sections
  missingSections: number; // analysis_result.summary.missing_sections
  uploadedAt: string;   // uploaded_at (ISO string)
  cloudinaryUrl: string;
}

export interface GetAllDocumentsResult {
  success: boolean;
  rows?: DocumentRow[];
  count?: number;
  totalUploads?: number;
  next?: string | null;
  previous?: string | null;
  error?: string;
}

function toDocumentRow(doc: LawUploadResult & {
  uploaded_at?: string;
  updated_at?: string;
  cloudinary_url: string;
}): DocumentRow {
  return {
    id: doc.document_id,
    name: doc.title,
    fileName: doc.file,
    sections: doc.analysis_result?.summary?.total_sections ?? 0,
    complianceScore: doc.analysis_result?.summary?.compliance_score ?? 0,
    flaggedSections: doc.analysis_result?.summary?.flagged_sections ?? 0,
    missingSections: doc.analysis_result?.summary?.missing_sections ?? 0,
    uploadedAt: (doc as { uploaded_at?: string }).uploaded_at ?? '',
    cloudinaryUrl: doc.cloudinary_url,
  };
}

export async function getAllLawDocumentsAction(
  page = 1
): Promise<GetAllDocumentsResult> {
  try {
    const api = await createBackendClient();
    const res = await api.get<LawDocumentListResponse>(
      `/api/v1/document/law-upload/`,
      { params: { page } }
    );
    const data = res.data;
    return {
      success: true,
      rows: data.results.map(toDocumentRow),
      count: data.count,
      totalUploads: data.total_uploads,
      next: data.next,
      previous: data.previous,
    };
  } catch (err) {
    const { error } = extractError(err);
    return { success: false, error };
  }
}

// ── Get single document by ID ─────────────────────────────────────────────────

export async function getLawDocumentAction(
  id: string
): Promise<LawUploadActionResult> {
  try {
    const api = await createBackendClient();
    const res = await api.get<LawUploadResult>(
      `/api/v1/document/law-upload/${id}`
    );
    // Wrap single result into the same shape as the upload response
    const data: LawUploadResponse = {
      total: 1,
      success: 1,
      skipped: 0,
      failed: 0,
      total_chunks: 0,
      results: [res.data],
    };
    return { success: true, data };
  } catch (err) {
    const { error, fieldErrors } = extractError(err);
    return { success: false, error, fieldErrors };
  }
}

// ── Upload law document ───────────────────────────────────────────────────────

export async function uploadLawDocumentAction(
  formData: FormData
): Promise<LawUploadActionResult> {
  try {
    const api = await createBackendClient();
    const res = await api.post<LawUploadResponse>(
      '/api/v1/document/law-upload/',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return { success: true, data: res.data };
  } catch (err) {
    const { error, fieldErrors } = extractError(err);
    return { success: false, error, fieldErrors };
  }
}