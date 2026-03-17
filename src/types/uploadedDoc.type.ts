export interface ApiCategory {
  id: string;
  name: string;
}

export interface LawSummary {
  total_sections: number;
  compliance_score: number;
  flagged_sections: number;
  missing_sections: number;
  total_contradictions: number;
}

export interface LawSection {
  review: string;
  status: string;
  section_id: string;
  section_name: string;
  section_text?: string;
  suggested_changes: string;
}

export interface AnalysisResult {
  summary: LawSummary;
  sections: LawSection[];
}

export interface LawStep {
  name: string;
  description: string;
  status: string;
  detail: string;
}

export interface ApiDocument {
  document_id: string;
  title: string;
  file: string;
  category: string;
  cloudinary_url: string;
  pinecone_doc_id: string;
  analysis_result: AnalysisResult;
  uploaded_at: string;
  steps: LawStep[];
}

export interface DocumentsApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  user: string;
  total_uploads: number;
  results: ApiDocument[];
}