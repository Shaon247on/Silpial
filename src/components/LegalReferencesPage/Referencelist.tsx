"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { debounce } from "@/lib/debounce";
import type { ApiDocument, ApiCategory } from "@/types/Document.type";
import { CategorySelect } from "../dashboard/admin/Categorypicker";

interface Props {
  documents: ApiDocument[];
  selectedId: string | null;
  currentSearch: string;
  currentCategory: string;
  initialCategories: ApiCategory[];
  initialCategoriesHasMore: boolean;
  totalCount: number;
  currentPage: number;
  isLoading?: boolean;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSelect: (id: string) => void;
}

export default function ReferenceList({
  documents,
  selectedId,
  currentSearch,
  currentCategory,
  initialCategories,
  initialCategoriesHasMore,
  isLoading,
  onSearchChange,
  onCategoryChange,
  onSelect,
}: Props) {
  const debouncedSearch = useRef(
    debounce((value: string) => {
      onSearchChange(value);
    }, 400)
  ).current;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="shrink-0">
        <h2 className="mb-5 text-lg font-bold text-[#07162D]">
          Lista de Referencias
        </h2>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <div className="min-w-0 flex-1">
            <CategorySelect
              name="category"
              defaultValue={currentCategory}
              initialCategories={initialCategories}
              initialHasMore={initialCategoriesHasMore}
              placeholder="Todas las categorías"
              onChange={(id) => onCategoryChange(id)}
            />
          </div>

          <div className="relative min-w-0 flex-1">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>

            <Input
              key={currentSearch}
              defaultValue={currentSearch}
              placeholder="Buscar"
              onChange={(e) => debouncedSearch(e.target.value)}
              className="h-10 border-gray-200 bg-white pl-9 pr-4 text-sm placeholder:text-gray-400 focus:border-[#07162D] focus:ring-[#07162D]/20"
            />
          </div>
        </div>

        <div className="mb-4 border-b border-gray-100" />
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div
            className={`flex flex-col gap-3 pr-3 pb-2 transition-opacity duration-150 ${
              isLoading ? "pointer-events-none opacity-60" : ""
            }`}
          >
            {documents.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <svg
                  className="mb-3 h-10 w-10 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-sm text-gray-400">No references found</p>
              </div>
            )}

            {documents.map((doc, i) => {
              const isSelected = selectedId === doc.id;

              return (
                <motion.button
                  key={doc.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.25, ease: "easeOut" }}
                  onClick={() => onSelect(doc.id)}
                  className="w-full cursor-pointer rounded-xl border p-4 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#07162D]"
                  style={{
                    borderColor: isSelected ? "#07162D" : "#E5E7EB",
                    backgroundColor: isSelected ? "rgba(7,22,45,0.04)" : "white",
                    boxShadow: isSelected ? "0 2px 12px rgba(7,22,45,0.08)" : "none",
                  }}
                >
                  <h3 className="mb-1.5 text-sm font-semibold leading-snug text-[#07162D]">
                    {doc.title}
                  </h3>

                  <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-gray-500">
                    {doc.category_name || "Sin descripción disponible."}
                  </p>

                  <div className="flex items-center gap-1.5">
                    <svg
                      className="h-3.5 w-3.5 shrink-0 text-[#9CA3AF]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs text-[#9CA3AF]">
                      Última actualización:{" "}
                      {doc.updated_at
                        ? new Date(doc.updated_at).toLocaleDateString("es-ES")
                        : "N/A"}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}