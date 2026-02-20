"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LegalReference, Category } from "@/types/law.type";
import { categories } from "@/data/LawData";

interface ReferenceListProps {
  references: LegalReference[];
  selectedId: string | null;
  onSelect: (ref: LegalReference) => void;
}

export default function ReferenceList({
  references,
  selectedId,
  onSelect,
}: ReferenceListProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("Todas las categorías");

  const filtered = references.filter((r) => {
    const matchesSearch =
      search === "" ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.shortDescription.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      category === "Todas las categorías" || r.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    /*
     * The outer div is h-full so it stretches to fill whatever height
     * the parent panel gives it. overflow-hidden is critical — it stops
     * the inner content from ever pushing the panel taller during the
     * width animation, which was causing the jumpy scroll behaviour.
     */
    <div className="flex flex-col h-full overflow-hidden">

      {/* ── Fixed header area (never scrolls) ── */}
      <div className="flex-shrink-0">
        <h2
          className="text-lg font-bold mb-5"
          style={{ color: "#07162D" }}
        >
          Lista de Referencias
        </h2>

        {/* Filters row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          {/* Category dropdown */}
          <div className="relative flex-1 min-w-0">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full appearance-none border border-gray-200 rounded-lg px-4 py-2.5 text-sm pr-8 focus:outline-none focus:ring-2 focus:ring-[#07162D]/20 focus:border-[#07162D] transition-colors cursor-pointer bg-white truncate"
              style={{ color: "#07162D" }}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none flex-shrink-0"
              style={{ color: "#07162D" }}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#07162D]/20 focus:border-[#07162D] transition-colors placeholder:text-gray-400 bg-white"
              style={{ color: "#07162D" }}
            />
          </div>
        </div>

        {/* Thin divider */}
        <div className="border-b border-gray-100 mb-4" />
      </div>

      {/* ── Scrollable law cards (shadcn ScrollArea) ── */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="flex flex-col gap-3 pr-3 pb-2">
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg
                className="w-10 h-10 text-gray-300 mb-3"
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

          {filtered.map((ref, i) => {
            const isSelected = selectedId === ref.id;
            return (
              <motion.button
                key={ref.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.35, ease: "easeOut" }}
                onClick={() => onSelect(ref)}
                className="text-left w-full rounded-xl border p-4 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#07162D] cursor-pointer"
                style={{
                  borderColor: isSelected ? "#07162D" : "#E5E7EB",
                  backgroundColor: isSelected ? "rgba(7,22,45,0.04)" : "white",
                  boxShadow: isSelected
                    ? "0 2px 12px rgba(7,22,45,0.08)"
                    : "none",
                }}
              >
                {/* Title */}
                <h3
                  className="text-sm font-semibold leading-snug mb-1.5"
                  style={{ color: "#07162D" }}
                >
                  {ref.title}
                </h3>

                {/* Short description */}
                <p
                  className="text-xs leading-relaxed mb-3 line-clamp-2"
                  style={{ color: "#6B7280" }}
                >
                  {ref.shortDescription}
                </p>

                {/* Date */}
                <div className="flex items-center gap-1.5">
                  <svg
                    className="w-3.5 h-3.5 flex-shrink-0"
                    style={{ color: "#9CA3AF" }}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs" style={{ color: "#9CA3AF" }}>
                    Última actualización: {ref.updatedAt}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}