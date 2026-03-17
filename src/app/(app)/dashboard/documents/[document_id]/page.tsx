import { notFound } from "next/navigation";
import { getLawDocumentAction } from "@/actions/user/doc.action";
import DocDetailsClient from "@/components/dashboard/user/documents/DocDetailsPage";

interface Props {
  params: { document_id: string };
}

export default async function DocDetailsPage({ params }: Props) {
  const { document_id } = await params;
console.log("the id:", document_id)
  const result = await getLawDocumentAction(document_id);

  if (!result.success || !result.data?.results?.[0]) {
    notFound();
  }

  const doc = result.data.results[0];

  return <DocDetailsClient doc={doc} />;
}