 import { Document } from "@/types/Document.type";

export const recentDocuments: Document[] = [
  {
    id: "1",
    name: "Public Infrastructure Maintenance Contract 2026",
    sections: 42,
    lastModified: "Today at 12:45",
    status: "compliant",
    complianceScore: 97,
  },
  {
    id: "2",
    name: "IT Services Framework Agreement",
    sections: 38,
    lastModified: "Today at 12:45",
    status: "review",
    complianceScore: 74,
  },
  {
    id: "3",
    name: "Municipal Waste Management Tender",
    sections: 38,
    lastModified: "Today at 12:45",
    status: "compliant",
    complianceScore: 91,
  },
  {
    id: "4",
    name: "Urban Planning Consultation Services",
    sections: 38,
    lastModified: "Today at 12:45",
    status: "non-compliant",
    complianceScore: 43,
  },
  {
    id: "5",
    name: "IT Services Framework Agreement",
    sections: 38,
    lastModified: "Today at 12:45",
    status: "pending",
    complianceScore: 68,
  },
];

export const allDocuments: Document[] = [
  ...recentDocuments,
  {
    id: "6",
    name: "Healthcare Procurement Standards 2025",
    sections: 55,
    lastModified: "Yesterday at 09:30",
    status: "compliant",
    complianceScore: 99,
  },
  {
    id: "7",
    name: "Road Infrastructure Bidding Framework",
    sections: 29,
    lastModified: "Yesterday at 14:10",
    status: "review",
    complianceScore: 61,
  },
  {
    id: "8",
    name: "Public Safety Equipment Tender 2025",
    sections: 33,
    lastModified: "Feb 17 at 11:00",
    status: "compliant",
    complianceScore: 88,
  },
];