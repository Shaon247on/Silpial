import { ClauseStatus, DocumentStatus } from "@/types/index.type";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export function getStatusColor(status: ClauseStatus | DocumentStatus): string {
  switch (status) {
    case "present":
    case "compliant":
      return "text-emerald-600";
    case "outdated":
    case "review":
      return "text-amber-600";
    case "missing":
    case "wrong":
    case "non-compliant":
      return "text-red-600";
    case "pending":
      return "text-gray-500";
    default:
      return "text-gray-500";
  }
}

export function getStatusBg(status: ClauseStatus | DocumentStatus): string {
  switch (status) {
    case "present":
    case "compliant":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "outdated":
    case "review":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    case "missing":
    case "wrong":
    case "non-compliant":
      return "bg-red-50 text-red-700 border border-red-200";
    case "pending":
      return "bg-gray-100 text-gray-600 border border-gray-200";
    default:
      return "bg-gray-100 text-gray-600 border border-gray-200";
  }
}

export function getStatusLabel(status: ClauseStatus | DocumentStatus): string {
  const labels: Record<string, string> = {
    present: "Present",
    outdated: "Outdated",
    missing: "Missing",
    wrong: "Wrong",
    compliant: "Compliant",
    review: "Under Review",
    "non-compliant": "Non-Compliant",
    pending: "Pending",
  };
  return labels[status] ?? status;
}

export function paginate<T>(items: T[], page: number, perPage: number): T[] {
  const start = (page - 1) * perPage;
  return items.slice(start, start + perPage);
}

export function totalPages(total: number, perPage: number): number {
  return Math.ceil(total / perPage);
}