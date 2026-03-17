// ─── User types ──────────────────────────────────────────────────────────────

export type UserStatus = "Active" | "Banned";

export interface User {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  documents: number;
  lastLogin: string;
}

// ─── Legal Reference types ────────────────────────────────────────────────────

export type LegalCategory =
  | "General Legislation"
  | "Regulations"
  | "Practical Guides"
  | "Contract Execution"
  | "Procurement";

export interface LegalReference {
  id: string;
  title: string;
  category: LegalCategory;
  lastModified: string;
}

// ─── Chart types ──────────────────────────────────────────────────────────────

export interface ActivityDataPoint {
  label: string;
  value: number;
}


