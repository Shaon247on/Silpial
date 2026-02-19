export type DocumentStatus = "compliant" | "review" | "non-compliant" | "pending";

export interface Document {
  id: string;
  name: string;
  sections: number;
  lastModified: string;
  status: DocumentStatus;
  complianceScore: number;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}



