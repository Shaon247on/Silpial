import PageHeader from "@/components/elements/PageHeader";
import DocumentsTable from "@/components/dashboard/DocumentsTable";
import { recentDocuments } from "@/data/DocumentsData";

export default function DashboardPage() {
  return (
    <div className="max-w-480 mx-auto">
      <PageHeader showCreateButton={true} />
      <DocumentsTable documents={recentDocuments} title="Recent documents" />
    </div>
  );
}
