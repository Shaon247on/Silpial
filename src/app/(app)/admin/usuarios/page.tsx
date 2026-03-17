// src/app/(app)/admin/usuarios/page.tsx   ← adjust path if needed

import { createBackendClient } from '@/lib/http/backend.client';
import { requireAdmin } from '@/lib/auth/guards';
import UsersPage from '@/components/dashboard/admin/UserManagement';
import { User } from '@/types/User.type';

interface SearchParams {
  search?: string;
  status?: string;
  page?: string;
}

interface StatsResponse {
  total: number;
  active: number;
  blocked: number;
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;   // ← important: Promise type
}) {
  await requireAdmin();

  // ── Await searchParams first ────────────────────────────────
  const params = await searchParams;     // now safe to access .search, .page, etc.

  const api = await createBackendClient();

  // ── List query params ───────────────────────────────────────
  const listParams = new URLSearchParams();
  if (params.search) {
    listParams.set('search', params.search);
  }
  if (params.status && params.status !== 'All') {
    listParams.set('status', params.status);
  }
  listParams.set('page', (Number(params.page) || 1).toString());
  listParams.set('page_size', '5');   // ← confirm exact param name with backend

  // ── Stats (no params needed) ────────────────────────────────
  const statsPromise = api.get<StatsResponse>('/api/v1/admin/users/stats/');

  const listPromise = api.get<{
    count: number;
    next: string | null;
    previous: string | null;
    results: User[];
  }>('/api/v1/admin/users/', { params: listParams });

  let users: User[] = [];
  let stats: StatsResponse = { total: 0, active: 0, blocked: 0 };

  try {
    const [statsRes, listRes] = await Promise.all([statsPromise, listPromise]);

    stats = statsRes.data;
    users = listRes.data.results;
  } catch (err) {
    console.error('Failed to load users or stats:', err);
    // Optionally: you could return an error component here
  }

  return (
    <div className="p-6">
      <UsersPage
        users={users}
        totalCount={stats.total}
        activeCount={stats.active}
        blockedCount={stats.blocked}
        currentPage={Number(params.page) || 1}
        currentSearch={params.search || ''}
        currentStatus={params.status || 'All'}
      />
    </div>
  );
}