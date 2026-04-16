import PageHeader from "@/components/elements/PageHeader";
import DocumentsTable from "@/components/dashboard/DocumentsTable";
import type { ApiDocument } from "@/types/uploadedDoc.type";
import type { ApiDocument as Document } from "@/types/uploadedDoc.type";
import { fetchDocuments } from "@/lib/services/uploadDoc.service";
import { getSession } from "@/lib/auth/guards";

// ── Map API shape → DocumentsTable shape ──────────────────────────────────────

function toDocument(api: ApiDocument): Document {
  const summary = api.analysis_result?.summary;
  return {
    id:              api.document_id,
    name:            api.title,
    sections:        summary?.total_sections
                       ? `${summary.total_sections} section${summary.total_sections !== 1 ? "s" : ""}`
                       : api.category || "—",
    lastModified:    new Intl.DateTimeFormat("en-GB", {
                       day: "2-digit", month: "short", year: "numeric",
                     }).format(new Date(api.uploaded_at)),
    complianceScore: summary?.compliance_score ?? 0,
    status:          "active",
  };
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  // Fetch first page, show up to 5 most recent — no pagination needed here
  const { documents: apiDocs } = await fetchDocuments(undefined, undefined, 1);
  const recentDocuments        = apiDocs.slice(0, 5).map(toDocument);
  const data = await getSession()

  return (
    <div className="max-w-480 mx-auto">
      <PageHeader showCreateButton={true} username={data?.user.full_name}/>
      <DocumentsTable documents={recentDocuments} title="Recent Documents" />
    </div>
  );
}