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
    if (selected?.id === ref.id) {
      setSelected(null);
    } else {
      setSelected(ref);
    }
  };

  const handleClose = () => setSelected(null);

  return (
    <div className="min-h-scree">
      {/* header section  */}
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
      {/* ── Split layout ── */}

      <div className="max-w-480 mx-auto">
        <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden  shadow-sm md:max-h-[calc(100vh-220px)] flex">
          {/* Left panel — Reference List */}
          <motion.div
            animate={{ width: selected ? "42%" : "100%" }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="shrink-0 border-r border-gray-100 p-6 md:max-h-[calc(100vh-220px)] overflow-scroll"
            style={{ minWidth: 0 }}
          >
            <ReferenceList
              references={legalReferences}
              selectedId={selected?.id ?? null}
              onSelect={handleSelect}
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
    </div>
  );
}
