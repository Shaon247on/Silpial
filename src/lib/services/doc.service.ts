import { createBackendClient } from '@/lib/http/backend.client';
import type { ApiDocument, PaginatedDocuments, ApiCategory } from '@/types/Document.type';

interface PaginatedCategories {
  count: number;
  next: number;
  results: ApiCategory[];
}

// ── Fetch all documents (optionally filtered by category) ─────────────────────

export interface FetchDocumentsResult {
  documents: ApiDocument[];
  total: number;
}

export async function fetchDocuments(
  categoryId?: string,
  search?: string,
  page?: number
): Promise<FetchDocumentsResult> {
  const api = await createBackendClient();

  const params = new URLSearchParams();
  if (categoryId) params.set('category', categoryId);
  if (search)     params.set('search', search);
  if (page && page > 1) params.set('page', String(page));

  const res = await api.get<PaginatedDocuments>(
    `/api/v1/document/documents/?${params.toString()}`,
    { headers: { 'Cache-Control': 'no-store' } }
  );

  return { documents: res.data.results, total: res.data.count };
}

// ── Fetch single document ─────────────────────────────────────────────────────

export async function fetchDocument(id: string): Promise<ApiDocument> {
  const api = await createBackendClient();
  const res = await api.get<ApiDocument>(`/api/v1/document/documents/${id}/`);
  return res.data;
}

// ── Fetch per-category document counts (parallel requests) ────────────────────

export interface CategoryCount {
  id: string;
  count: number;
}

export async function fetchCategoryCounts(
  categoryIds: string[]
): Promise<CategoryCount[]> {
  if (!categoryIds.length) return [];

  const api = await createBackendClient();

  const results = await Promise.allSettled(
    categoryIds.map((id) =>
      api
        .get<PaginatedDocuments>(`/api/v1/document/documents/?category=${id}&page_size=1`)
        .then((r) => ({ id, count: r.data.count }))
    )
  );

  return results
    .filter((r): r is PromiseFulfilledResult<CategoryCount> => r.status === "fulfilled")
    .map((r) => r.value);
}

export interface FetchCategoriesResult {
  categories: ApiCategory[];
  hasMore: boolean;
  total: number;
}

export async function fetchInitialCategories(): Promise<FetchCategoriesResult> {
  const api = await createBackendClient();
  const res = await api.get<PaginatedCategories>(
    '/api/v1/document/categories/?page=1'
  );
  return {
    categories: res.data.results ?? [],
    hasMore: !!res.data.next,
    total: res.data.count,
  };
}

// Keep for backward compat (detail page uses it)
export async function fetchAllCategories(): Promise<ApiCategory[]> {
  const { categories } = await fetchInitialCategories();
  return categories;
}