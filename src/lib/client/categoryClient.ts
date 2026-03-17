import type { ApiCategory } from "@/types/Document.type";

export interface PaginatedCategoriesResult {
  categories: ApiCategory[];
  hasMore: boolean;
  nextPage: number;
}

/**
 * Fetches a page of categories from the client side.
 * Calls the Next.js route handler which proxies to the backend with auth.
 */
export async function fetchCategoriesPage(
  page: number,
  search?: string
): Promise<PaginatedCategoriesResult> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  if (search?.trim()) params.set("name", search.trim());

  const res = await fetch(`/api/admin/categories?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch categories");

  const data = await res.json();
  return {
    categories: data.results ?? [],
    hasMore: !!data.next,
    nextPage: page + 1,
  };
}