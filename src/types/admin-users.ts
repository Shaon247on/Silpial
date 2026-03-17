export type UserStatus = "Activo" | "Bloqueado";
export type FilterStatus = "All" | UserStatus;

export type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  documents: number;
  lastLogin: string;
};