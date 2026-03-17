export interface User {
  id: string;
  full_name: string;
  username: string;
  email: string;
  is_active: boolean;
  is_banned: boolean;
  status: "active" | "blocked";
  document_count: number;
  last_access: string | null;
  date_joined: string;
}

export type DisplayUser = User & {
  displayName: string;
  displayStatus: "Activo" | "Bloqueado";
  displayLastAccess: string;
  displayDocumentCount: string;
};
