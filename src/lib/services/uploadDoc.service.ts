import { createBackendClient } from "@/lib/http/backend.client";
import type {
  ApiCategory,
  ApiDocument,
  DocumentsApiResponse,
} from "@/types/uploadedDoc.type";

export interface FetchDocumentsResult {
  documents: ApiDocument[];
  total: number;
  next: string | null;
  previous: string | null;
}

export interface FetchCategoriesResult {
  categories: ApiCategory[];
  hasMore: boolean;
  total: number;
}

/**
 * Fetch paginated law-upload documents
 */
export async function fetchDocuments(
  categoryId?: string,
  search?: string,
  page?: number
): Promise<FetchDocumentsResult> {
  const api = await createBackendClient();

  const params = new URLSearchParams();

  if (categoryId) params.set("category", categoryId);
  if (search) params.set("search", search);
  if (page && page > 1) params.set("page", String(page));

  const query = params.toString();

  const res = await api.get<DocumentsApiResponse>(
    `/api/v1/document/law-upload/${query ? `?${query}` : ""}`,
    {
      headers: { "Cache-Control": "no-store" },
    }
  );

  return {
    documents: res.data.results ?? [],
    total: res.data.total_uploads ?? res.data.count ?? 0,
    next: res.data.next ?? null,
    previous: res.data.previous ?? null,
  };
}

/**
 * Fetch single document
 */
export async function fetchDocument(id: string): Promise<ApiDocument | null> {
  const api = await createBackendClient();

  let nextUrl: string | null = "/api/v1/document/law-upload/";

  while (nextUrl) {
    const res: { data: DocumentsApiResponse } = await api.get<DocumentsApiResponse>(
      nextUrl,
      {
        headers: { "Cache-Control": "no-store" },
      }
    );

    const found: ApiDocument | undefined = res.data.results?.find(
      (doc: ApiDocument) => doc.document_id === id
    );

    if (found) return found;

    const nextPageUrl: string | null = res.data.next ?? null;
    if (!nextPageUrl) break;

    try {
      const parsedNext = new URL(nextPageUrl);
      nextUrl = `${parsedNext.pathname}${parsedNext.search}`;
    } catch {
      nextUrl = null;
    }
  }

  return null;
}

/**
 * Build categories from available documents
 */
export async function fetchInitialCategories(): Promise<FetchCategoriesResult> {
  const api = await createBackendClient();

  const res = await api.get<DocumentsApiResponse>(
    "/api/v1/document/law-upload/?page=1",
    {
      headers: { "Cache-Control": "no-store" },
    }
  );

  const categoryMap = new Map<string, ApiCategory>();

  for (const doc of res.data.results ?? []) {
    if (doc.category && doc.category) {
      categoryMap.set(doc.category, {
        id: doc.category,
        name: doc.category,
      });
    }
  }

  const categories = Array.from(categoryMap.values());

  return {
    categories,
    hasMore: false,
    total: categories.length,
  };
}

export async function fetchAllCategories(): Promise<ApiCategory[]> {
  const { categories } = await fetchInitialCategories();
  return categories;
}