"use client";

import { useState, useMemo } from "react";
import { Search, Eye, Plus, FileText, BookOpen } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Pagination from "@/components/elements/Pagination";
import { LegalCategory } from "@/types/Admin.type";
import { DUMMY_LEGAL_REFS } from "@/data/adminData";
import { categories } from "@/data/LawData";
import UploadDialog from "./UploadDialog";
import Link from "next/link";

const CATEGORY_STYLES: Record<
  LegalCategory,
  { bg: string; text: string; border: string }
> = {
  "General Legislation": {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-100",
  },
  Regulations: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-100",
  },
  "Practical Guides": {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-100",
  },
  "Contract Execution": {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-100",
  },
  Procurement: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-100",
  },
};
const PER_PAGE = 5;
type FilterCategory = "All" | LegalCategory;
export default function LegalReferencesPage() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>("All");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () =>
      DUMMY_LEGAL_REFS.filter((ref) => {
        const matchSearch =
          !search || ref.title.toLowerCase().includes(search.toLowerCase());
        const matchCat =
          categoryFilter === "All" || ref.category === categoryFilter;
        return matchSearch && matchCat;
      }),
    [search, categoryFilter],
  );

  const handleSearch = (v: string) => {
    setSearch(v);
    setPage(1);
  };
  const handleFilter = (v: string) => {
    setCategoryFilter(v as FilterCategory);
    setPage(1);
  };
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#07172D] leading-tight">
            Referencias Legales
          </h1>
          <p className="text-[13px] text-gray-400 mt-0.5">
            Carga y administra todas las leyes de licitación visibles para los usuarios
          </p>
        </div>
        <Button
          onClick={() => setUploadOpen(true)}
          className="bg-[#07172D] hover:bg-[#0d2240] text-white border-0 rounded-xl h-10 px-4 text-[13px] font-semibold gap-2 self-start sm:self-auto shadow-sm transition-all duration-200 hover:shadow-md"
        >
          <Plus className="w-4 h-4" />
          Cargar Nueva Ley
        </Button>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        {[
          {
            label: "Todas las Referencias",
            value: DUMMY_LEGAL_REFS.length,
            active: categoryFilter === "All",
            onClick: () => handleFilter("All"),
          },
          ...categories.map((c) => ({
            label: c,
            value: DUMMY_LEGAL_REFS.filter((r) => r.category === c).length,
            active: categoryFilter === c,
            onClick: () => handleFilter(c),
          })),
        ].map((chip) => (
          <button
            key={chip.label}
            onClick={chip.onClick}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-all duration-150 ${
              chip.active
                ? "bg-[#07172D] text-white border-[#07172D] shadow-sm"
                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            {chip.label}
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                chip.active
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {chip.value}
            </span>
          </button>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <Input
            placeholder="Buscar por título…"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 h-10 border-gray-200 rounded-xl bg-white focus-visible:ring-[#07172D]/20 focus-visible:border-[#07172D] text-sm placeholder:text-gray-400"
          />
        </div>
        <Select value={categoryFilter} onValueChange={handleFilter}>
          <SelectTrigger className="w-full sm:w-52 h-10 border-gray-200 rounded-xl text-sm bg-white focus:ring-[#07172D]/20">
            <SelectValue placeholder="Todas las Categorías" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">Todas las Categorías</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[14px] font-semibold text-[#07172D]">
            Todas las Referencias Legales
          </h2>
          <span className="text-[12px] text-gray-400 font-medium">
            {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="rounded-2xl border border-gray-100 overflow-hidden bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-145">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3.5 w-[44%]">
                    Título
                  </th>
                  <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3.5">
                    Categoría
                  </th>
                  <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3.5">
                    Última Modificación
                  </th>
                  <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3.5">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            No se encontraron referencias
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            Intenta ajustar tu búsqueda o filtro
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((ref) => {
                    const style = CATEGORY_STYLES[ref.category];
                    return (
                      <tr
                        key={ref.id}
                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors duration-150 group"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors">
                              <FileText className="w-3.5 h-3.5 text-gray-500" />
                            </div>
                            <span className="text-[13px] font-semibold text-[#07172D] truncate leading-snug">
                              {ref.title}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full border ${style?.bg} ${style?.text} ${style?.border}`}
                          >
                            {ref.category}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-[12px] text-gray-400 font-medium tabular-nums">
                          {ref.lastModified}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <Link href={`/admin/legal/${ref.id}`}>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="w-8 h-8 rounded-lg text-gray-400 hover:text-[#07172D] hover:bg-[#07172D]/8 transition-all"
                            title="Ver documento"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        page={page}
        total={filtered.length}
        perPage={PER_PAGE}
        onChange={setPage}
      />

      {/* Upload dialog */}
      <UploadDialog open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </div>
  );
}
