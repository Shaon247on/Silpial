"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LegalReference } from "@/types/law.type";
import { legalReferences } from "@/data/LawData";
import ReferenceList from "@/components/LegalReferencesPage/Referencelist";
import LawDetail from "@/components/LegalReferencesPage/LawDetail";
import PageHeader from "@/components/elements/PageHeader";
import { LawAlert } from "@/components/elements/LawAlert";

export default function LegalReferences() {
  const [selected, setSelected] = useState<LegalReference | null>(null);

  const handleSelect = (ref: LegalReference) => {
    setSelected((prev) => (prev?.id === ref.id ? null : ref));
  };

  const handleClose = () => setSelected(null);

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <PageHeader
          title="Legal References"
          subtitle="Browse and read official tender laws uploaded for reference."
        />
        <LawAlert
          subtitle="All laws and regulations are officially uploaded by platform administrators and sourced from authenticated legal references."
          title="Verified Regulatory Framework"
        />
      </div>

      <div className="mx-auto max-w-[1400px]">
        <div className="flex h-[calc(100vh-220px)] min-h-[600px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {/* Left panel */}
          <motion.div
            animate={{ width: selected ? "42%" : "100%" }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="h-full shrink-0 overflow-y-auto border-r border-gray-100 p-6"
            style={{ minWidth: 0 }}
          >
            <ReferenceList
              references={legalReferences}
              selectedId={selected?.id ?? null}
              onSelect={handleSelect}
            />
          </motion.div>

          {/* Right panel */}
          <AnimatePresence initial={false}>
            {selected && (
              <motion.div
                key={selected.id}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "58%", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="h-full shrink-0 overflow-hidden"
                style={{ minWidth: 0 }}
              >
                <div className="h-full overflow-y-auto p-6">
                  <LawDetail reference={selected} onClose={handleClose} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}