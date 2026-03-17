import { getAllLawDocumentsAction } from "@/actions/user/doc.action";
import DocumentsTable from "@/components/dashboard/user/documents/DocumentsTable";

interface Props {
  searchParams?: Promise<{ page?: string }>;
}

export default async function DocumentsPage({ searchParams }: Props) {
  const resolved = await searchParams;
  const page = Number(resolved?.page ?? "1");

  const result = await getAllLawDocumentsAction(page);

  return (
    <DocumentsTable
      rows={result.rows ?? []}
      count={result.count ?? 0}
      totalUploads={result.totalUploads ?? 0}
      currentPage={page}
      hasNext={!!result.next}
      hasPrevious={!!result.previous}
      error={result.error}
    />
  );
}
