import LegalReferencesPage from "@/components/LegalReferencesPage/LegalReferencesPage";
import {
  fetchDocument,
  fetchDocuments,
  fetchInitialCategories,
} from "@/lib/services/doc.service";

type PageProps = {
  searchParams: Promise<{
    search?: string;
    category?: string;
    selected?: string;
    page?: string;
  }>;
};

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;

  const search = params.search ?? "";
  const category = params.category ?? "";
  const selected = params.selected ?? "";
  const page = Number(params.page ?? "1");

  const [documentsRes, categoriesRes, selectedDocument] = await Promise.all([
    fetchDocuments(category || undefined, search || undefined, page),
    fetchInitialCategories(),
    selected
      ? fetchDocument(selected).catch(() => null)
      : Promise.resolve(null),
  ]);

  return (
    <LegalReferencesPage
      documents={documentsRes.documents}
      totalCount={documentsRes.total}
      currentPage={page}
      currentSearch={search}
      currentCategory={category}
      selectedDocument={selectedDocument}
      initialCategories={categoriesRes.categories}
      initialCategoriesHasMore={categoriesRes.hasMore}
      hasNextPage={Boolean(documentsRes.next)}
      hasPreviousPage={Boolean(documentsRes.previous)}
    />
  );
}