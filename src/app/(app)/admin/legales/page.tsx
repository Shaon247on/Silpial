import { requireAdmin } from '@/lib/auth/guards';
import LegalReferencesTable from '@/components/dashboard/admin/LegalReferencesTable';
import { fetchCategoryCounts, fetchDocuments, fetchInitialCategories } from '@/lib/services/doc.service';

interface SearchParams {
  category?: string;
  search?: string;
  page?: string;
}

export const metadata = {
  title: 'Referencias Legales',
  description: 'Gestión de documentos legales',
};

export default async function LegalReferencesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireAdmin();

  const params     = await searchParams;
  const page       = Number(params.page) || 1;
  const search     = params.search ?? '';
  const categoryId = params.category ?? '';

  const [{ documents, total }, { categories, hasMore: categoriesHasMore }] = await Promise.all([
    fetchDocuments(categoryId, search, page),
    fetchInitialCategories(),
  ]);

  const categoryCounts = await fetchCategoryCounts(categories.map((c) => c.id));

  return (
    <div className="p-6">
      <LegalReferencesTable
        initialDocuments={documents}
        totalCount={total}
        initialCategories={categories}
        categoriesHasMore={categoriesHasMore}
        categoryCounts={categoryCounts}
        currentPage={page}
        currentSearch={search}
        currentCategory={categoryId}
      />
    </div>
  );
}