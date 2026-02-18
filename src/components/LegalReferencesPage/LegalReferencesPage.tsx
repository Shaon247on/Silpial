"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LegalReference } from "@/types/law.type";
import ReferenceList from "./Referencelist";
import { legalReferences } from "@/data/LawData";
import LawDetail from "./LawDetail";

export default function LegalReferencesPage() {
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
    <div className="min-h-screen bg-white">
      <section
        className="relative py-40 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{ backgroundColor: "#09182F" }}
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-100 h-100 rounded-full bg-blue-500 blur-[100px] opacity-10 pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 text-xs font-medium text-white/50 border border-white/10 rounded-full px-4 py-1.5 bg-white/5 tracking-widest uppercase mb-6">
              All Legal References are here
            </span>
            <h1
              className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4"
              style={{
                fontFamily: "'Georgia', serif",
                letterSpacing: "-0.02em",
              }}
            >
              Legal References
            </h1>
            <p className="text-base text-white/50 leading-relaxed">
              Comprehensive legal frameworks and regulatory guidelines
              supporting compliant public tender preparation.
            </p>
            <div className="mt-8 flex items-start gap-3 border border-white/10 bg-white/5 backdrop-blur-sm rounded-xl px-5 py-4">
              <svg
                className="w-5 h-5 text-blue-400 shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>

              <p className="text-sm text-white/70 leading-relaxed">
                All laws are uploaded by the platform administrator and sourced
                from official legal references.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Split layout ── */}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 py-10">
        <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm h-[680px] flex">
          {/* Left panel — Reference List */}
          <motion.div
            animate={{ width: selected ? "42%" : "100%" }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="shrink-0 border-r border-gray-100 p-6 h-full overflow-hidden"
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
