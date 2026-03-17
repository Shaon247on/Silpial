import "server-only";
import { serverApi } from "@/lib/axios/server-api";

export type BackendUserStatus = "active" | "blocked";

export type AdminUserApi = {
  id: string;
  full_name: string;
  username: string;
  email: string;
  is_active: boolean;
  is_banned: boolean;
  status: BackendUserStatus;
  document_count: number;
  last_access: string | null;
  date_joined: string;
};

export type GetAdminUsersResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: AdminUserApi[];
};

type GetAdminUsersParams = {
  search?: string;
  status?: BackendUserStatus;
  page?: number;
};

export async function getAdminUsers({
  search,
  status,
  page,
}: GetAdminUsersParams): Promise<GetAdminUsersResponse> {
  const params = new URLSearchParams();

  if (search) params.set("search", search);
  if (status) params.set("status", status);
  if (page) params.set("page", String(page));

  const query = params.toString();
  const url = `/api/v1/admin/users/${query ? `?${query}` : ""}`;

  const { data } = await serverApi.get<GetAdminUsersResponse>(url);

  return data;
}