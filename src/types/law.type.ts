export interface LegalReference {
  id: string;
  title: string;
  shortDescription: string;
  category: string;
  updatedAt: string;
  fullText: string;
  articles: Article[];
}

export interface Article {
  id: string;
  heading: string;
  body: string;
}