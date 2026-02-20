import CategoriesTable from "@/components/dashboard/admin/CategoryManagemen/CategoriesTable";

export const metadata = {
  title: "Category Management",
  description: "Manage all categories in the platform",
};

const dummyCategories = [
  { id: "1", name: "Procurement" },
  { id: "2", name: "Regulations" },
  { id: "3", name: "General Legislation" },
  { id: "4", name: "Contract Execution" },
  { id: "5", name: "Practical Guides" },
  { id: "6", name: "Finance" },
  { id: "7", name: "Compliance" },
  { id: "8", name: "Audit" },
  { id: "9", name: "Tendering" },
  { id: "10", name: "Supply Chain" },
  { id: "11", name: "Logistics" },
  { id: "12", name: "Legal Framework" },
];

export default function CategoryManagementPage() {
  return (
    <section className="p-6 space-y-4">
      <div>
        <h1 className=" text-3xl font-bold mb-2">
          Category Management
        </h1>
        <p className="text-slate-400">Manage all categories</p>
      </div>

      <CategoriesTable initialCategories={dummyCategories} />
    </section>
  );
}
