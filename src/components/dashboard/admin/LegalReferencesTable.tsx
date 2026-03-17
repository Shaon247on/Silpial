"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search, Eye, Plus, FileText, BookOpen, X, Upload, Loader2,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Pagination, PaginationContent, PaginationEllipsis,
  PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";

import type { ApiDocument, ApiCategory } from "@/types/Document.type";
import { debounce } from "@/lib/debounce";
import { CategorySelect, CategorySelectRef, ChipFilterBar, getCategoryPalette } from "./Categorypicker";
import { createDocumentAction } from "@/actions/admin/doc.action";

// ── helpers ────────────────────────────────────────────────────────────────────

function buildPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "ellipsis")[] = [1];
  if (current > 3) pages.push("ellipsis");
  const start = Math.max(2, current - 1);
  const end   = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push("ellipsis");
  pages.push(total);
  return pages;
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit", month: "short", year: "numeric",
  }).format(new Date(iso));
}

// ── Props ──────────────────────────────────────────────────────────────────────
interface Props {
  initialDocuments: ApiDocument[];
  totalCount: number;
  initialCategories: ApiCategory[];
  categoriesHasMore: boolean;
  categoryCounts: { id: string; count: number }[];
  currentPage: number;
  currentSearch: string;
  currentCategory: string;
}

const PER_PAGE = 10;

// ── Upload Dialog ──────────────────────────────────────────────────────────────

function UploadDialog({
  open,
  onClose,
  initialCategories,
  categoriesHasMore,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  initialCategories: ApiCategory[];
  categoriesHasMore: boolean;
  onSuccess: (doc: ApiDocument) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [file, setFile]             = useState<File | null>(null);
  const [dragOver, setDragOver]     = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const fileRef      = useRef<HTMLInputElement>(null);
  const categoryRef  = useRef<CategorySelectRef>(null);

  function handleFile(f: File | null) {
    if (!f) return;
    if (f.type !== "application/pdf") { setError("Solo se permiten archivos PDF."); return; }
    setFile(f); setError(null);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null); setFieldErrors({});
    if (!file) { setError("Selecciona un archivo PDF."); return; }

    const fd = new FormData(e.currentTarget);
    fd.set("pdf_file", file);

    startTransition(async () => {
      const result = await createDocumentAction(fd);
      if (result.success && result.data) {
        onSuccess(result.data);
        setFile(null);
        categoryRef.current?.reset();
        onClose();
      } else {
        setError(result.error ?? "Error al subir.");
        setFieldErrors(result.fieldErrors ?? {});
      }
    });
  }

  const handleClose = () => { if (!isPending) { setFile(null); setError(null); setFieldErrors({}); onClose(); } };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-md rounded-2xl border-0 shadow-2xl p-0 overflow-hidden">
        <div className="h-1 w-full bg-[#07172D]" />
        <div className="p-6">
          <DialogHeader className="mb-5">
            <DialogTitle className="text-[#07172D] text-[17px] font-bold">Cargar Nuevo Documento</DialogTitle>
            <DialogDescription className="text-gray-500 text-[13px]">
              Sube un documento PDF y asígnale una categoría.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="text-[12px] font-semibold text-[#07172D] block mb-1.5">Título</label>
              <Input
                name="title"
                placeholder="Nombre del documento legal"
                required
                className="h-10 rounded-xl border-gray-200 text-[13px] focus-visible:border-[#07172D] focus-visible:ring-[#07172D]/20"
              />
              {fieldErrors.title && <p className="text-[11px] text-red-500 mt-1">{fieldErrors.title}</p>}
            </div>

            {/* Category — infinite scroll select */}
            <div>
              <label className="text-[12px] font-semibold text-[#07172D] block mb-1.5">Categoría</label>
              <CategorySelect
                ref={categoryRef}
                name="category"
                initialCategories={initialCategories}
                initialHasMore={categoriesHasMore}
                required
                error={fieldErrors.category}
              />
            </div>

            {/* File drop zone */}
            <div>
              <label className="text-[12px] font-semibold text-[#07172D] block mb-1.5">Archivo PDF</label>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
                onClick={() => fileRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-150 ${
                  dragOver
                    ? "border-[#07172D] bg-[#07172D]/5"
                    : file
                    ? "border-emerald-300 bg-emerald-50"
                    : "border-gray-200 hover:border-gray-300 bg-gray-50/50"
                }`}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                />
                {file ? (
                  <div className="flex items-center justify-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-[13px] font-semibold text-emerald-700 truncate max-w-[220px]">{file.name}</p>
                      <p className="text-[11px] text-emerald-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      className="ml-auto text-emerald-500 hover:text-emerald-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                      <Upload className="w-4 h-4 text-gray-400" />
                    </div>
                    <p className="text-[13px] text-gray-500">
                      Arrastra tu PDF aquí o <span className="text-[#07172D] font-semibold">haz clic</span>
                    </p>
                    <p className="text-[11px] text-gray-400">Solo archivos PDF</p>
                  </div>
                )}
              </div>
              {fieldErrors.pdf_file && <p className="text-[11px] text-red-500 mt-1">{fieldErrors.pdf_file}</p>}
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 px-3.5 py-2.5 text-[12px] text-red-600">
                {error}
              </div>
            )}

            <DialogFooter className="gap-2 pt-1">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}
                className="rounded-xl border-gray-200 text-[13px] font-semibold">
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}
                className="rounded-xl bg-[#07172D] hover:bg-[#0d2240] text-white text-[13px] font-semibold border-0">
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Upload className="w-4 h-4 mr-1.5" />Subir</>}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function LegalReferencesTable({
  initialDocuments,
  totalCount,
  initialCategories,
  categoriesHasMore,
  categoryCounts,
  currentPage,
  currentSearch,
  currentCategory,
}: Props) {
  const router = useRouter();
  const [isNavigating, startNavTransition] = useTransition();

  const [documents, setDocuments] = useState<ApiDocument[]>(initialDocuments);
  const [total, setTotal]         = useState(totalCount);
  const [page, setPage]           = useState(currentPage);
  const [search, setSearch]       = useState(currentSearch);
  const [categoryId, setCategoryId] = useState(currentCategory);
  const [uploadOpen, setUploadOpen] = useState(false);

  // Sync when server re-renders with new props after navigation
  const prevCategory = useRef(currentCategory);
  if (prevCategory.current !== currentCategory) {
    prevCategory.current = currentCategory;
    setDocuments(initialDocuments);
    setTotal(totalCount);
    setCategoryId(currentCategory);
    setPage(currentPage);
  }

  // Category lookup maps for the table rows
  const catIndexMap = Object.fromEntries(initialCategories.map((c, i) => [c.id, i]));
  const catNameMap  = Object.fromEntries(initialCategories.map((c) => [c.id, c.name]));

  // ── URL sync ────────────────────────────────────────────────────────────────
  function navigate(nextSearch: string, nextCat: string, nextPage: number) {
    startNavTransition(() => {
      const params = new URLSearchParams();
      if (nextSearch.trim()) params.set("search", nextSearch.trim());
      if (nextCat)           params.set("category", nextCat);
      if (nextPage > 1)      params.set("page", nextPage.toString());
      router.replace(`?${params.toString()}`, { scroll: false });
    });
  }

  const debouncedSearch = useRef(
    debounce((v: string) => { setSearch(v); setPage(1); navigate(v, categoryId, 1); }, 500)
  ).current;

  function handleCategoryChange(id: string) {
    setCategoryId(id); setPage(1); navigate(search, id, 1);
  }

  function handlePage(next: number) { setPage(next); navigate(search, categoryId, next); }

  // Pagination
  const totalPages  = Math.max(1, Math.ceil(total / PER_PAGE));
  const pageNumbers = buildPageNumbers(page, totalPages);

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#07172D] leading-tight">Referencias Legales</h1>
          <p className="text-[13px] text-gray-400 mt-0.5">
            Carga y administra todos los documentos legales de la plataforma
          </p>
        </div>
        <Button
          onClick={() => setUploadOpen(true)}
          className="bg-[#07172D] hover:bg-[#0d2240] text-white border-0 rounded-xl h-10 px-4 text-[13px] font-semibold gap-2 self-start sm:self-auto shadow-sm"
        >
          <Plus className="w-4 h-4" /> Cargar Documento
        </Button>
      </div>

      {/* Category chips — infinite scroll */}
      <ChipFilterBar
        initialCategories={initialCategories}
        initialHasMore={categoriesHasMore}
        totalCount={totalCount}
        categoryCounts={categoryCounts}
        selectedId={categoryId}
        onChange={handleCategoryChange}
        isLoading={isNavigating}
      />

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <Input
          placeholder="Buscar por título…"
          defaultValue={currentSearch}
          onChange={(e) => debouncedSearch(e.target.value)}
          className="pl-10 h-10 border-gray-200 rounded-xl bg-white focus-visible:ring-[#07172D]/20 focus-visible:border-[#07172D] text-sm placeholder:text-gray-400"
        />
      </div>

      {/* Result count */}
      <div className="flex items-center justify-between">
        <h2 className="text-[14px] font-semibold text-[#07172D]">Documentos Legales</h2>
        <span className="text-[12px] text-gray-400 font-medium">{total} resultado{total !== 1 ? "s" : ""}</span>
      </div>

      {/* Table */}
      <div className={`rounded-2xl border border-gray-100 overflow-hidden bg-white shadow-sm transition-opacity duration-150 ${isNavigating ? "opacity-60 pointer-events-none" : ""}`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                {["Título", "Categoría", "Subido", "Acciones"].map((col, i) => (
                  <th key={col} className={`text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3.5 ${i === 3 ? "text-right" : "text-left"}`}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {documents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-500">No se encontraron documentos</p>
                      <p className="text-xs text-gray-400">Intenta ajustar tu búsqueda o filtro</p>
                    </div>
                  </td>
                </tr>
              ) : (
                documents.map((doc) => {
                  const catIdx   = doc.category ? (catIndexMap[doc.category] ?? 0) : 0;
                  const catStyle = getCategoryPalette(catIdx);
                  const catName  = doc.category ? (catNameMap[doc.category] ?? doc.category) : null;
                  return (
                    <tr key={doc.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors duration-150 group">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 group-hover:bg-gray-200 transition-colors">
                            <FileText className="w-3.5 h-3.5 text-gray-500" />
                          </div>
                          <span className="text-[13px] font-semibold text-[#07172D] truncate">{doc.title}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        {catName ? (
                          <span className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}>
                            {catName}
                          </span>
                        ) : (
                          <span className="text-[11px] text-gray-300 italic">Sin categoría</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-[12px] text-gray-400 tabular-nums font-medium">
                        {formatDate(doc.created_at)}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link href={`/admin/legales/${doc.id}`}>
                          <Button size="icon" variant="ghost"
                            className="w-8 h-8 rounded-lg text-gray-400 hover:text-[#07172D] hover:bg-[#07172D]/8 transition-all"
                            title="Ver documento">
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <p className="text-[12px] text-gray-400 shrink-0">
            Página <span className="font-semibold text-[#07172D]">{page}</span> de{" "}
            <span className="font-semibold text-[#07172D]">{totalPages}</span>
            {" · "}<span className="font-semibold text-[#07172D]">{total}</span> documentos
          </p>
          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={() => page > 1 && handlePage(page - 1)} aria-disabled={page === 1}
                  className={page === 1 ? "pointer-events-none opacity-40" : "cursor-pointer"} />
              </PaginationItem>
              {pageNumbers.map((p, idx) =>
                p === "ellipsis" ? (
                  <PaginationItem key={`e-${idx}`}><PaginationEllipsis /></PaginationItem>
                ) : (
                  <PaginationItem key={p}>
                    <PaginationLink isActive={p === page} onClick={() => p !== page && handlePage(p as number)}
                      className={p !== page ? "cursor-pointer" : ""}>
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext onClick={() => page < totalPages && handlePage(page + 1)} aria-disabled={page === totalPages}
                  className={page === totalPages ? "pointer-events-none opacity-40" : "cursor-pointer"} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Upload dialog */}
      <UploadDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        initialCategories={initialCategories}
        categoriesHasMore={categoriesHasMore}
        onSuccess={(doc) => { setDocuments((prev) => [doc, ...prev]); setTotal((t) => t + 1); }}
      />
    </div>
  );
}