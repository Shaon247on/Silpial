import { createBackendClient } from '@/lib/http/backend.client';
import { Category } from '@/types/category.type';


interface PaginatedCategories {
  count: number;
  next: string | null;
  previous: string | null;
  results: Category[];
}

export interface FetchCategoriesResult {
  categories: Category[];
  total: number;
}

export async function fetchCategories(
  search?: string,
  page?: number
): Promise<FetchCategoriesResult> {
  const api = await createBackendClient();

  const params = new URLSearchParams();
  if (search) params.set('name', search);
  if (page && page > 1) params.set('page', String(page));

  const res = await api.get<PaginatedCategories>(
    `/api/v1/document/categories/?${params.toString()}`,
    { headers: { 'Cache-Control': 'no-store' } }
  );

  return {
    categories: res.data.results,
    total: res.data.count,
  };
}