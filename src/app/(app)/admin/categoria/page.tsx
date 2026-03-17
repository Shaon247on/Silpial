
import CategoriesTable from '@/components/dashboard/admin/CategoryManagemen/CategoriesTable';
import { requireAdmin } from '@/lib/auth/guards';
import { fetchCategories } from '@/lib/services/category.service';

export const metadata = {
  title: 'Gestión de Categorías',
  description: 'Administra todas las categorías de la plataforma',
};

interface SearchParams {
  search?: string;
  page?: string;
}

export default async function CategoryManagementPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireAdmin();

  const params = await searchParams;
  const page   = Number(params.page) || 1;
  const search = params.search ?? '';

  const { categories, total } = await fetchCategories(search, page);

  return (
    <section className="p-6 space-y-4">
      <div>
        <h1 className="text-3xl font-bold mb-2">Gestión de Categorías</h1>
        <p className="text-slate-400">Administra todas las categorías de la plataforma</p>
      </div>

      <CategoriesTable
        initialCategories={categories}
        totalCount={total}
        currentPage={page}
        currentSearch={search}
      />
    </section>
  );
}