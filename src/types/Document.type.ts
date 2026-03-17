
export interface ApiDocument {
  id: string;
  title: string;
  category: string | null;
  category_name?: string;
  uploaded_by?: string;
  cloudinary_url: string;
  pinecone_doc_id?: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedDocuments {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiDocument[];
}


export interface ApiCategory {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}