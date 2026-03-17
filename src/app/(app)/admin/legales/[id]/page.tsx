import LegalDocumentDetail from "@/components/dashboard/admin/LegalDocumentDetail";
import { requireAdmin } from "@/lib/auth/guards";
import { fetchAllCategories, fetchDocument } from "@/lib/services/doc.service";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LegalDocumentDetailPage({ params }: Props) {
  await requireAdmin();

  const { id } = await params;

  let document;
  let categories;

  try {
    [document, categories] = await Promise.all([
      fetchDocument(id),
      fetchAllCategories(),
    ]);
  } catch {
    notFound();
  }

  return (
    <div className="p-6">
      <LegalDocumentDetail document={document} categories={categories} />
    </div>
  );
}
