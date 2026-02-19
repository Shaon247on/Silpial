// ─── Document & Clause Types ────────────────────────────────────────────────

export type ClauseStatus = "present" | "outdated" | "missing" | "wrong";

export type DocumentStatus = "compliant" | "review" | "non-compliant" | "pending";

export interface Clause {
  id: string;
  title: string;
  category: string;
  status: ClauseStatus;
  explanation: string;
  complianceScore: number;
  aiGenerated: string;
  aiSuggested: string;
  legalRef: string;
  foundIn?: string;
}

export interface DocumentRecord {
  id: string;
  name: string;
  sections: number;
  lastModified: string;
  status: DocumentStatus;
  complianceScore: number;
  clauses?: Clause[];
}

// ─── AI Processing Types ─────────────────────────────────────────────────────

export type StepStatus = "pending" | "in-progress" | "complete";

export interface AnalysisStep {
  id: number;
  title: string;
  description: string;
  status: StepStatus;
  durationMs: number;
}

// ─── Review Page Types ────────────────────────────────────────────────────────

export type ReviewMode = "comparison" | "edit";

export interface ReviewState {
  clauseId: string;
  selectedVersion: "generated" | "suggested" | null;
  manualText: string;
  mode: ReviewMode;
  saved: boolean;
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginationState {
  page: number;
  perPage: number;
  total: number;
}

// ─── Filter ───────────────────────────────────────────────────────────────────

export type FilterStatus = "all" | ClauseStatus;