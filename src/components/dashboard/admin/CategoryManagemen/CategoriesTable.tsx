"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Search, Loader2, Tag } from "lucide-react";
import { debounce } from "@/lib/debounce";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/actions/admin/category.action";
import { Category } from "@/types/category.type";

// ── Page number builder ───────────────────────────────────────────────────────

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

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  initialCategories: Category[];
  totalCount: number;
  currentPage: number;
  currentSearch: string;
}

const PAGE_SIZE = 10;

// ── Component ─────────────────────────────────────────────────────────────────

export default function CategoriesTable({
  initialCategories,
  totalCount,
  currentPage,
  currentSearch,
}: Props) {
  const router = useRouter();
  const [isNavigating, startNavTransition] = useTransition();

  // ── Local state ──────────────────────────────────────────────────────────────
  const [page, setPage]     = useState(currentPage);
  const [search, setSearch] = useState(currentSearch);

  // Optimistic list — updated immediately on success
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [total, setTotal]           = useState(totalCount);

  // Create / Edit dialog
  const [isDialogOpen,    setIsDialogOpen]    = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [dialogError,     setDialogError]     = useState<string | null>(null);
  const [isSubmitting,    startSubmitTransition] = useTransition();

  // Delete dialog
  const [isDeleteOpen,      setIsDeleteOpen]      = useState(false);
  const [deletingCategory,  setDeletingCategory]  = useState<Category | null>(null);
  const [deleteError,       setDeleteError]       = useState<string | null>(null);
  const [isDeleting,        startDeleteTransition] = useTransition();

  // ── URL navigation ────────────────────────────────────────────────────────────
  function navigate(nextSearch: string, nextPage: number) {
    startNavTransition(() => {
      const params = new URLSearchParams();
      if (nextSearch.trim()) params.set("search", nextSearch.trim());
      if (nextPage > 1)      params.set("page",   nextPage.toString());
      router.replace(`?${params.toString()}`, { scroll: false });
    });
  }

  const debouncedSearch = useRef(
    debounce((value: string) => {
      setSearch(value);
      setPage(1);
      navigate(value, 1);
    }, 500)
  ).current;

  function handlePage(next: number) {
    setPage(next);
    navigate(search, next);
  }

  // ── Open dialog ───────────────────────────────────────────────────────────────
  function openDialog(category?: Category) {
    setEditingCategory(category ?? null);
    setDialogError(null);
    setIsDialogOpen(true);
  }

  // ── Submit (create or update) ─────────────────────────────────────────────────
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const name = (new FormData(e.currentTarget).get("name") as string).trim();
    if (!name) return;

    startSubmitTransition(async () => {
      if (editingCategory) {
        const result = await updateCategoryAction(editingCategory.id, name);
        if (result.success && result.data) {
          setCategories((prev) =>
            prev.map((c) => (c.id === editingCategory.id ? result.data! : c))
          );
          setIsDialogOpen(false);
        } else {
          setDialogError(result.error ?? "Error al actualizar.");
        }
      } else {
        const result = await createCategoryAction(name);
        if (result.success && result.data) {
          setCategories((prev) => [result.data!, ...prev]);
          setTotal((t) => t + 1);
          setIsDialogOpen(false);
        } else {
          setDialogError(result.error ?? "Error al crear.");
        }
      }
    });
  }

  // ── Delete ────────────────────────────────────────────────────────────────────
  function handleDelete() {
    if (!deletingCategory) return;
    setDeleteError(null);

    startDeleteTransition(async () => {
      const result = await deleteCategoryAction(deletingCategory.id);
      if (result.success) {
        setCategories((prev) => prev.filter((c) => c.id !== deletingCategory.id));
        setTotal((t) => Math.max(0, t - 1));
        setIsDeleteOpen(false);
      } else {
        setDeleteError(result.error ?? "Error al eliminar.");
      }
    });
  }

  // ── Pagination ────────────────────────────────────────────────────────────────
  const totalPages  = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageNumbers = buildPageNumbers(page, totalPages);

  return (
    <div className="space-y-4">

      {/* Search + Add */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          <Input
            className="pl-10 placeholder:text-slate-500 h-12"
            placeholder="Buscar por nombre…"
            defaultValue={currentSearch}
            onChange={(e) => debouncedSearch(e.target.value)}
          />
        </div>
        <Button onClick={() => openDialog()} className="h-12 gap-2">
          <Plus className="w-4 h-4" />
          Añadir Categoría
        </Button>
      </div>

      {/* ── Desktop Table ──────────────────────────────────────────────────────── */}
      <div className={`md:block hidden transition-opacity duration-150 ${isNavigating ? "opacity-60 pointer-events-none" : ""}`}>
        <Table className="bg-white p-4 rounded-lg px-6">
          <TableHeader className="px-6">
            <TableRow>
              <TableHead className="font-semibold ">No.</TableHead>
              <TableHead className="font-semibold ">Nombre</TableHead>
              <TableHead className="font-semibold ">Created At</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="px-6">
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
                      <Tag className="w-5 h-5 text-slate-500" />
                    </div>
                    <p className="text-sm text-slate-400">No se encontraron categorías</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category, index) => (
                <TableRow key={category.id}>
                  <TableCell>{(page - 1) * PAGE_SIZE + index + 1}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.created_at}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant="outline" onClick={() => openDialog(category)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => { setDeletingCategory(category); setDeleteError(null); setIsDeleteOpen(true); }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Mobile Card View ──────────────────────────────────────────────────── */}
      <div className={`md:hidden space-y-4 transition-opacity duration-150 ${isNavigating ? "opacity-60 pointer-events-none" : ""}`}>
        {categories.length === 0 ? (
          <div className="text-center py-10 text-slate-400">No se encontraron categorías</div>
        ) : (
          categories.map((category) => (
            <Card key={category.id} className="bg-slate-900 border-slate-800">
              <CardContent className="p-4 space-y-3">
                <h3 className="text-white font-semibold text-lg">{category.name}</h3>
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                  <Button size="sm" variant="outline" onClick={() => openDialog(category)}>
                    <Pencil className="w-4 h-4 mr-2" /> Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => { setDeletingCategory(category); setDeleteError(null); setIsDeleteOpen(true); }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* ── Shadcn Pagination ─────────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-4 flex-wrap pt-1">
          <p className="text-[12px] text-slate-400 shrink-0">
            Página <span className="font-semibold text-white">{page}</span> de{" "}
            <span className="font-semibold text-white">{totalPages}</span>
            {" · "}
            <span className="font-semibold text-white">{total}</span> categorías
          </p>

          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => page > 1 && handlePage(page - 1)}
                  aria-disabled={page === 1}
                  className={page === 1 ? "pointer-events-none opacity-40" : "cursor-pointer"}
                />
              </PaginationItem>

              {pageNumbers.map((p, idx) =>
                p === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={p}>
                    <PaginationLink
                      isActive={p === page}
                      onClick={() => p !== page && handlePage(p as number)}
                      className={p !== page ? "cursor-pointer" : ""}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => page < totalPages && handlePage(page + 1)}
                  aria-disabled={page === totalPages}
                  className={page === totalPages ? "pointer-events-none opacity-40" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* ── Create / Edit Dialog ──────────────────────────────────────────────── */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => { if (!isSubmitting) setIsDialogOpen(open); }}
      >
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle className="">
              {editingCategory ? "Editar Categoría" : "Añadir Nueva Categoría"}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {editingCategory
                ? "Actualiza el nombre de la categoría."
                : "Crea una nueva categoría para la plataforma."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm  mb-1.5 block">Nombre</label>
              <Input
                name="name"
                defaultValue={editingCategory?.name ?? ""}
                placeholder="Ingresa el nombre de la categoría"
                className=""
                required
                autoFocus
              />
              {/* Inline field error (e.g. duplicate name) */}
              {dialogError && (
                <p className="mt-2 text-[12px] text-red-400">{dialogError}</p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : editingCategory ? (
                  "Actualizar"
                ) : (
                  "Añadir"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Delete Alert ──────────────────────────────────────────────────────── */}
      <AlertDialog
        open={isDeleteOpen}
        onOpenChange={(open) => { if (!isDeleting) setIsDeleteOpen(open); }}
      >
        <AlertDialogContent className="">
          <AlertDialogHeader>
            <AlertDialogTitle className="">¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Estás a punto de eliminar la categoría{" "}
              <span className="font-semibold ">&ldquo;{deletingCategory?.name}&ldquo;</span>.
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {deleteError && (
            <p className="px-1 text-[12px] text-red-400">{deleteError}</p>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              className="bg-slate-800 border-slate-700  hover:bg-slate-700 disabled:opacity-50"
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => { e.preventDefault(); handleDelete(); }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-70"
            >
              {isDeleting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Eliminando…
                </span>
              ) : (
                "Eliminar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}