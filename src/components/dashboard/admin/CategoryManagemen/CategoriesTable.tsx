// app/dashboard/category-management/categories-table.tsx
"use client";

import { useState, useRef } from "react";
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
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { debounce } from "@/lib/debounce";
import { v4 as uuidv4 } from "uuid";

interface Category {
  id: string;
  name: string;
}

interface Props {
  initialCategories: Category[];
}

export default function CategoriesTable({ initialCategories }: Props) {
  const [categories, setCategories] = useState(initialCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const router = useRouter();
  const searchParams = useSearchParams();

  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete dialog
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null,
  );

  const debouncedSearch = useRef(
    debounce((value: string) => {
      setSearchTerm(value);
      setCurrentPage(1);
    }, 500),
  ).current;

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredCategories.length / pageSize);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const changePage = (page: number) => {
    setCurrentPage(page);
  };

  // Create / Edit
  const openDialog = (category?: Category) => {
    setEditingCategory(category || null);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;

    if (!name.trim()) return;

    setIsSubmitting(true);

    if (editingCategory) {
      // Update
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editingCategory.id ? { ...cat, name } : cat,
        ),
      );
    } else {
      // Create
      const newCategory = { id: uuidv4(), name };
      setCategories((prev) => [newCategory, ...prev]);
    }

    setIsSubmitting(false);
    setIsDialogOpen(false);
  };

  // Delete
  const handleDelete = () => {
    if (deletingCategory) {
      setCategories((prev) =>
        prev.filter((cat) => cat.id !== deletingCategory.id),
      );
      setIsDeleteOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 size-5 text-gray-500 top-1/2 -translate-y-1/2" />
          <Input
            className="pl-10  text-white placeholder:text-slate-500 h-12"
            placeholder="Buscar por nombre"
            onChange={(e) => debouncedSearch(e.target.value)}
          />
        </div>

        <Button onClick={() => openDialog()} className="h-12">
          <Plus className="w-5 h-5 mr-2" />
          Añadir Categoría
        </Button>
      </div>

      {/* Table */}
      <div className="md:block hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">Name</TableHead>
              <TableHead className="text-right ">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell className="text-right space-x-2 text-black">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openDialog(category)}
                  >
                    <Pencil className="h-4 w-4 text-black" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setDeletingCategory(category);
                      setIsDeleteOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {paginatedCategories.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            No categories found
          </div>
        ) : (
          paginatedCategories.map((category) => (
            <Card key={category.id} className="bg-slate-900 border-slate-800">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-white font-semibold text-lg">
                      {category.name}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openDialog(category)}
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setDeletingCategory(category);
                      setIsDeleteOpen(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled={currentPage === 1}
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                if (currentPage > 1) changePage(currentPage - 1);
              }}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }).map((_, index) => {
            const page = index + 1;
            return (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={page === currentPage}
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();
                    changePage(page);
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={currentPage === totalPages}
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                if (currentPage < totalPages) changePage(currentPage + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingCategory ? "Editar Categoría" : "Añadir Nueva Categoría"}
            </DialogTitle>
            <DialogDescription className="text-slate-300">
              {editingCategory
                ? "Actualiza el nombre de la categoría."
                : "Crea una nueva categoría."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-slate-300 mb-1 block">Nombre</label>
              <Input
                name="name"
                defaultValue={editingCategory?.name || ""}
                placeholder="Ingresa el nombre de la categoría"
                className="bg-slate-800 border-slate-700 text-white"
                required
              />
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

      {/* Delete Alert */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="bg-slate-900 border-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              ¿Estás seguro?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300">
              Esta acción no se puede deshacer. Esto eliminará permanentemente la categoría.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
