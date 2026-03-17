"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Download, Pencil, Trash2, FileText,
  Calendar, Tag, User, ExternalLink, Upload, X,
  Loader2, AlertTriangle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";

import type { ApiDocument, ApiCategory } from "@/types/Document.type";
import { deleteDocumentAction, updateDocumentAction } from "@/actions/admin/doc.action";
import { toast } from "sonner";

// ── helpers ────────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  }).format(new Date(iso));
}

const PALETTE = [
  { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-100",    icon: "bg-blue-100"    },
  { bg: "bg-violet-50",  text: "text-violet-700",  border: "border-violet-100",  icon: "bg-violet-100"  },
  { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-100",   icon: "bg-amber-100"   },
  { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100", icon: "bg-emerald-100" },
  { bg: "bg-rose-50",    text: "text-rose-700",    border: "border-rose-100",    icon: "bg-rose-100"    },
];

// ── Edit Dialog ────────────────────────────────────────────────────────────────

function EditDialog({
  open,
  onClose,
  document,
  categories,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  document: ApiDocument;
  categories: ApiCategory[];
  onSuccess: (doc: ApiDocument) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [file, setFile]     = useState<File | null>(null);
  const [error, setError]   = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File | null) {
    if (!f) return;
    if (f.type !== "application/pdf") { setError("Solo se permiten archivos PDF."); return; }
    setFile(f); setError(null);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null); setFieldErrors({});
    const fd = new FormData(e.currentTarget);
    if (file) fd.set("pdf_file", file);

    startTransition(async () => {
      const result = await updateDocumentAction(document.id, fd);
      if (result.success && result.data) {
        onSuccess(result.data);
        setFile(null);
        onClose();
      } else {
        setError(result.error ?? "Error al actualizar.");
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
            <DialogTitle className="text-[#07172D] text-[17px] font-bold">Editar Documento</DialogTitle>
            <DialogDescription className="text-gray-500 text-[13px]">
              Actualiza el título, categoría o reemplaza el archivo PDF.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[12px] font-semibold text-[#07172D] block mb-1.5">Título</label>
              <Input
                name="title"
                defaultValue={document.title}
                required
                className="h-10 rounded-xl border-gray-200 text-[13px] focus-visible:border-[#07172D] focus-visible:ring-[#07172D]/20"
              />
              {fieldErrors.title && <p className="text-[11px] text-red-500 mt-1">{fieldErrors.title}</p>}
            </div>

            <div>
              <label className="text-[12px] font-semibold text-[#07172D] block mb-1.5">Categoría</label>
              <Select name="category" defaultValue={document.category ?? ""}>
                <SelectTrigger className="h-10 rounded-xl border-gray-200 text-[13px] focus:ring-[#07172D]/20">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Optional PDF replacement */}
            <div>
              <label className="text-[12px] font-semibold text-[#07172D] block mb-1.5">
                Reemplazar PDF <span className="font-normal text-gray-400">(opcional)</span>
              </label>
              <div
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-150 ${
                  file ? "border-emerald-300 bg-emerald-50" : "border-gray-200 hover:border-gray-300 bg-gray-50/50"
                }`}
              >
                <input ref={fileRef} type="file" accept="application/pdf" className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
                {file ? (
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-[12px] font-semibold text-emerald-700 truncate">{file.name}</span>
                    <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      className="ml-auto text-emerald-500 hover:text-emerald-700 shrink-0">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <p className="text-[12px] text-gray-400">
                    <Upload className="w-3.5 h-3.5 inline mr-1.5" />
                    Haz clic para seleccionar un nuevo PDF
                  </p>
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
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

interface Props {
  document: ApiDocument;
  categories: ApiCategory[];
}

export default function LegalDocumentDetail({ document: initialDoc, categories }: Props) {
  const router = useRouter();
  const [doc, setDoc]         = useState<ApiDocument>(initialDoc);
  const [editOpen, setEditOpen]     = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();

  const catIdx  = doc.category ? categories.findIndex((c) => c.id === doc.category) : -1;
  const catName = catIdx >= 0 ? categories[catIdx].name : null;
  const catStyle = catIdx >= 0 ? PALETTE[catIdx % PALETTE.length] : PALETTE[0];

  // Is the cloudinary URL a PDF?
  const isPdf = doc.cloudinary_url?.toLowerCase().includes(".pdf") ||
                doc.cloudinary_url?.toLowerCase().includes("/raw/");

  function handleDelete() {
    setDeleteError(null);
    startDeleteTransition(async () => {
      const result = await deleteDocumentAction(doc.id);
      if (!result.success) {
        toast.error(result.error ?? "No se pudo eliminar el documento.");
        return;
      }

      toast.success("Documento eliminado correctamente.");

      router.push("/admin/legales");
      router.refresh();
    });
  }

  return (
    <div className="space-y-6 max-w-360 mx-auto">

      {/* ── Back + actions bar ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4">
        <Link href="/admin/legales">
          <Button variant="ghost" className="gap-2 text-[13px] text-gray-500 hover:text-[#07172D] rounded-xl px-3 -ml-3">
            <ArrowLeft className="w-4 h-4" /> Volver
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <a href={doc.cloudinary_url} download target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="h-9 gap-2 rounded-xl border-gray-200 text-[13px] font-semibold text-[#07172D]">
              <Download className="w-3.5 h-3.5" /> Descargar
            </Button>
          </a>
          <Button variant="outline" onClick={() => setEditOpen(true)}
            className="h-9 gap-2 rounded-xl border-gray-200 text-[13px] font-semibold text-[#07172D]">
            <Pencil className="w-3.5 h-3.5" /> Editar
          </Button>
          <Button variant="outline" onClick={() => { setDeleteError(null); setDeleteOpen(true); }}
            className="h-9 gap-2 rounded-xl border-red-100 text-[13px] font-semibold text-red-600 hover:bg-red-50 hover:border-red-200">
            <Trash2 className="w-3.5 h-3.5" /> Eliminar
          </Button>
        </div>
      </div>

      {/* ── Two-column layout ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">

        {/* ── PDF Preview panel ─────────────────────────────────────────── */}
        <div className="rounded-2xl border border-gray-100 overflow-hidden bg-white shadow-sm">
          {/* Panel header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#07172D]/8 flex items-center justify-center">
                <FileText className="w-3.5 h-3.5 text-[#07172D]" />
              </div>
              <span className="text-[13px] font-semibold text-[#07172D] truncate max-w-[280px]">{doc.title}</span>
            </div>
            <a href={doc.cloudinary_url} target="_blank" rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#07172D] transition-colors">
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* PDF iframe / fallback */}
          {isPdf ? (
            <iframe
              src={`${doc.cloudinary_url}#toolbar=0&navpanes=0`}
              className="w-full"
              style={{ height: "680px" }}
              title={doc.title}
            />
          ) : (
            /* Non-PDF cloudinary file — show image or unsupported notice */
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-6" style={{ minHeight: 400 }}>
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                <FileText className="w-7 h-7 text-gray-400" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[#07172D]">Vista previa no disponible</p>
                <p className="text-[12px] text-gray-400 mt-1">
                  Este tipo de archivo no puede previsualizarse en el navegador.
                </p>
              </div>
              <a href={doc.cloudinary_url} download target="_blank" rel="noopener noreferrer">
                <Button className="gap-2 rounded-xl bg-[#07172D] text-white text-[13px] border-0">
                  <Download className="w-3.5 h-3.5" /> Descargar Archivo
                </Button>
              </a>
            </div>
          )}
        </div>

        {/* ── Meta sidebar ──────────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Document info card */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
              <h2 className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Información del Documento</h2>
            </div>
            <div className="px-5 py-4 space-y-4">

              {/* Title */}
              <div>
                <p className="text-[11px] text-gray-400 font-medium mb-0.5">Título</p>
                <p className="text-[14px] font-bold text-[#07172D] leading-snug">{doc.title}</p>
              </div>

              {/* Category */}
              <div>
                <p className="text-[11px] text-gray-400 font-medium mb-1.5">Categoría</p>
                {catName ? (
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}>
                    <Tag className="w-3 h-3" /> {catName}
                  </span>
                ) : (
                  <span className="text-[12px] text-gray-300 italic">Sin categoría</span>
                )}
              </div>

              {/* Dates */}
              <div className="space-y-2.5 pt-1 border-t border-gray-50">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Calendar className="w-3 h-3 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Actualizada</p>
                    <p className="text-[12px] text-[#07172D] font-medium">{formatDate(doc?.updated_at)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Calendar className="w-3 h-3 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Última modificación</p>
                    <p className="text-[12px] text-[#07172D] font-medium">{formatDate(doc.updated_at)}</p>
                  </div>
                </div>
              </div>

              {/* Document ID */}
              <div className="pt-1 border-t border-gray-50">
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-1">ID del Documento</p>
                <p className="text-[11px] text-gray-400 font-mono break-all">{doc.id}</p>
              </div>
            </div>
          </div>

          {/* Quick actions card */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
              <h2 className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Acciones Rápidas</h2>
            </div>
            <div className="px-5 py-4 space-y-2">
              <a href={doc.cloudinary_url} download target="_blank" rel="noopener noreferrer" className="block">
                <Button variant="outline" className="w-full justify-start gap-2.5 h-9 rounded-xl border-gray-200 text-[13px] text-[#07172D] font-semibold">
                  <Download className="w-3.5 h-3.5" /> Descargar PDF
                </Button>
              </a>
              <a href={doc.cloudinary_url} target="_blank" rel="noopener noreferrer" className="block">
                <Button variant="outline" className="w-full justify-start gap-2.5 h-9 rounded-xl border-gray-200 text-[13px] text-gray-500 font-semibold">
                  <ExternalLink className="w-3.5 h-3.5" /> Abrir en nueva pestaña
                </Button>
              </a>
              <Button variant="outline" onClick={() => setEditOpen(true)}
                className="w-full justify-start gap-2.5 h-9 rounded-xl border-gray-200 text-[13px] text-[#07172D] font-semibold">
                <Pencil className="w-3.5 h-3.5" /> Editar documento
              </Button>
              <Button variant="outline" onClick={() => { setDeleteError(null); setDeleteOpen(true); }}
                className="w-full justify-start gap-2.5 h-9 rounded-xl border-red-100 text-[13px] text-red-600 font-semibold hover:bg-red-50 hover:border-red-200">
                <Trash2 className="w-3.5 h-3.5" /> Eliminar documento
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Edit Dialog ───────────────────────────────────────────────────── */}
      <EditDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        document={doc}
        categories={categories}
        onSuccess={(updated) => { setDoc(updated); setEditOpen(false); }}
      />

      {/* ── Delete Dialog ─────────────────────────────────────────────────── */}
      <AlertDialog open={deleteOpen} onOpenChange={(o) => { if (!isDeleting) setDeleteOpen(o); }}>
        <AlertDialogContent className="rounded-2xl max-w-[380px] p-0 overflow-hidden border-0 shadow-2xl">
          <div className="h-1.5 w-full bg-red-500" />
          <div className="p-6 pt-5">
            <div className="flex justify-center mb-5">
              <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
            </div>
            <AlertDialogHeader className="space-y-2 mb-5">
              <AlertDialogTitle className="text-[#07172D] text-[17px] font-bold text-center">
                ¿Eliminar este documento?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-500 text-[13px] text-center leading-relaxed">
                Estás a punto de eliminar{" "}
                <span className="font-semibold text-[#07172D]">"{doc.title}"</span>.
                Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>

            {deleteError && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-100 px-3.5 py-2.5 text-[12px] text-red-600 text-center">
                {deleteError}
              </div>
            )}

            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
              <AlertDialogCancel disabled={isDeleting}
                className="flex-1 rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 h-10 text-[13px] font-semibold disabled:opacity-50">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => { e.preventDefault(); handleDelete(); }}
                disabled={isDeleting}
                className="flex-1 rounded-xl border-0 bg-red-600 hover:bg-red-700 text-white font-semibold h-10 text-[13px] disabled:opacity-70"
              >
                {isDeleting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Eliminando…
                  </span>
                ) : "Sí, Eliminar"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}