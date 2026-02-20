"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LegalReference } from "@/types/law.type";
import { legalReferences } from "@/data/LawData";
import LawDetail from "@/components/LegalReferencesPage/LawDetail";
import PageHeader from "@/components/elements/PageHeader";
import { LawAlert } from "@/components/elements/LawAlert";
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
import UploadDialog from "./UploadDialog";
import EditDialog from "./EditDialog";
import ReferenceList from "./ReferenceList";

export default function LegalReferences() {
  const [selected, setSelected] = useState<LegalReference | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editRef, setEditRef] = useState<LegalReference | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteRef, setDeleteRef] = useState<LegalReference | null>(null);
  const [references, setReferences] = useState(legalReferences); // Local state for demo; use API in production

  const handleSelect = (ref: LegalReference) => {
    if (selected?.id === ref.id) {
      setSelected(null);
    } else {
      setSelected(ref);
    }
  };

  const handleClose = () => setSelected(null);

  const handleEdit = (ref: LegalReference) => {
    setEditRef(ref);
    setEditOpen(true);
  };

  const handleUpdate = (updatedRef: LegalReference) => {
    // Update local state; in production, call server action
    setReferences((prev) =>
      prev.map((r) => (r.id === updatedRef.id ? updatedRef : r)),
    );
    if (selected?.id === updatedRef.id) {
      setSelected(updatedRef);
    }
    setEditOpen(false);
  };

  const handleOpenDelete = (ref: LegalReference) => {
    setDeleteRef(ref);
    setDeleteOpen(true);
  };

  const handleDelete = () => {
    if (!deleteRef) return;
    // Delete via server action in production
    setReferences((prev) => prev.filter((r) => r.id !== deleteRef.id));
    if (selected?.id === deleteRef.id) {
      setSelected(null);
    }
    setDeleteOpen(false);
  };

  return (
    <div className="min-h-screen">
      {/* header section */}
      <div className="mb-6">
        <PageHeader
          title="Referencias Legales"
          subtitle="Examina y lee las leyes oficiales de licitación cargadas como referencia."
        />
        <LawAlert
          subtitle="Todas las leyes y regulaciones son cargadas oficialmente por administradores de la plataforma y provienen de referencias legales autenticadas."
          title="Marco Regulatorio Verificado"
        />
      </div>

      {/* ── Split layout ── */}
      <div className="max-w-480 mx-auto">
        <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden shadow-sm md:max-h-[calc(100vh-220px)] flex">
          {/* Left panel — Reference List */}
          <motion.div
            animate={{ width: selected ? "42%" : "100%" }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="shrink-0 border-r border-gray-100 p-6 md:max-h-[calc(100vh-220px)] overflow-scroll"
            style={{ minWidth: 0 }}
          >
            <ReferenceList
              references={references}
              selectedId={selected?.id ?? null}
              onSelect={handleSelect}
              onEdit={handleEdit}
              onDelete={handleOpenDelete}
            />
          </motion.div>

          {/* Right panel — Law Detail */}
          <AnimatePresence initial={false}>
            {selected && (
              <motion.div
                key="detail-panel"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "58%", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="shrink-0 h-full overflow-hidden"
                style={{ minWidth: 0 }}
              >
                <div className="p-6 h-full overflow-hidden">
                  <LawDetail reference={selected} onClose={handleClose} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Dialogs */}
      <UploadDialog open={uploadOpen} onClose={() => setUploadOpen(false)} />
      {editRef && (
        <EditDialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          reference={editRef}
          onUpdate={handleUpdate}
        />
      )}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar Referencia?</AlertDialogTitle>
            <AlertDialogDescription>
              Esto eliminará permanentemente &ldquo;{deleteRef?.title}&ldquo;.
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
