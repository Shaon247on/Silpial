"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  total: number;
  perPage: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, total, perPage, onChange }: PaginationProps) {
  const totalPgs = Math.ceil(total / perPage);
  if (totalPgs <= 1) return null;

  const getPages = (): (number | "...")[] => {
    if (totalPgs <= 6) return Array.from({ length: totalPgs }, (_, i) => i + 1);
    const pages: (number | "...")[] = [1];
    if (page > 3) pages.push("...");
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPgs - 1, page + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (page < totalPgs - 2) pages.push("...");
    pages.push(totalPgs);
    return pages;
  };

  const btn =
    "w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-150";

  return (
    <div className="flex items-center justify-between mt-5 flex-wrap gap-3">
      <p className="text-sm text-[#4A5565]">
        Showing {Math.min((page - 1) * perPage + 1, total)} to{" "}
        {Math.min(page * perPage, total)} of {total} results
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className={cn(btn, "border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed")}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getPages().map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className={cn(btn, "text-gray-400")}>
              <MoreHorizontal className="w-4 h-4" />
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p as number)}
              className={cn(
                btn,
                p === page
                  ? "bg-[#07172D] text-white"
                  : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              )}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPgs}
          className={cn(btn, "border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed")}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}