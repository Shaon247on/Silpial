
export interface FAQItem {
  q: string;
  a: string;
}

export interface FAQCategory {
  label: string;
  icon: React.ReactNode;
  items: FAQItem[];
}