"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Pencil, X, Info, ArrowLeft, Save } from "lucide-react";
import { VersionCard } from "@/components/elements/VersionCard";
import { dummyClauses } from "@/data/indexData";
import { ReviewMode } from "@/types/index.type";
import StatusBadge from "@/components/elements/StatusBadge";

const fade = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function RequireReviewPage() {
  const params = useParams<{ docId: string; clauseId: string }>();
  const router = useRouter();
  const clauseId = params?.clauseId ?? "";
  const docId = params?.docId ?? "doc1";

  console.log("doc ID:", docId);
  console.log("clause ID:", clauseId);

  const clause = useMemo(
    () => dummyClauses.find((c) => c.id === clauseId),
    [clauseId],
  );

  const [mode, setMode] = useState<ReviewMode>("comparison");
  const [selectedVersion, setSelectedVersion] = useState<
    "generated" | "suggested" | null
  >(null);
  const [manualText, setManualText] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (clause) setManualText(clause.aiSuggested);
  }, [clause]);

  if (!clause) {
    return (
      <div className="flex items-center justify-center h-64 text-[#4A5565]">
        Clause not found.
      </div>
    );
  }

  const handleAccept = (version: "generated" | "suggested") => {
    setSelectedVersion(version);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      router.push(`/dashboard/documents/${docId}`);
    }, 1000);
  };

  const sectionNum = clauseId.replace("c", "");

  return (
    <div className="max-w-480 mx-auto">
      {/* Back */}
      <button
        onClick={() => router.push(`/dashboard/documents/${docId}`)}
        className="flex items-center gap-1.5 text-sm text-[#4A5565] hover:text-[#07172D] transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to document
      </button>

      {/* Header */}
      <motion.div
        variants={fade}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-xl font-bold text-[#07172D]">
            {sectionNum}. {clause.title}
          </h1>
          <StatusBadge status={clause.status} />
        </div>
        <p className="text-sm text-[#4A5565]">
          Review AI suggestions and make your decision.
        </p>
      </motion.div>

      {/* Info Banner */}
      <motion.div
        variants={fade}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.08 }}
      >
        <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 text-sm mb-6">
          <Info className="w-4 h-4 mt-0.5 shrink-0" />
          <span>
            All suggestions require your explicit approval. You can accept,
            edit, or reject each suggestion.
          </span>
        </div>
      </motion.div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {mode === "comparison" ? (
          <motion.div
            key="comparison"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* Side-by-side cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* AI Generated */}
              <VersionCard
                label="AI generated version"
                text={
                  clause.aiGenerated || "(No current text found in document)"
                }
                selected={selectedVersion === "generated"}
                onAccept={() => handleAccept("generated")}
                acceptLabel="Accept"
              />
              {/* AI Suggested */}
              <VersionCard
                label="AI-suggested version"
                text={clause.aiSuggested}
                selected={selectedVersion === "suggested"}
                onAccept={() => handleAccept("suggested")}
                acceptLabel="Proceed"
              />
            </div>

            {/* Bottom actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => router.push(`/dashboard/documents/${docId}`)}
                className="px-5 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium text-[#07172D] hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4 inline mr-1.5" />
                Cancel
              </button>
              <button
                onClick={() => {
                  setManualText(clause.aiSuggested);
                  setMode("edit");
                }}
                className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Pencil className="w-4 h-4" />
                Edit manually
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="edit"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* Side-by-side reference + edit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Read-only generated */}
              <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-[#07172D]">
                    AI generated version
                  </h3>
                </div>
                <div className="p-5">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {clause.aiGenerated ||
                      "(No current text found in document)"}
                  </p>
                </div>
              </div>

              {/* AI suggested read-only */}
              <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-[#07172D]">
                    AI-suggested version
                  </h3>
                </div>
                <div className="p-5">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {clause.aiSuggested}
                  </p>
                </div>
              </div>
            </div>

            {/* Edit manually section */}
            <div className="mb-6">
              <h3 className="text-base font-semibold text-[#07172D] mb-3">
                Edit manually
              </h3>
              <textarea
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                rows={8}
                className="w-full px-4 py-3.5 text-sm text-gray-800 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 resize-none leading-relaxed bg-white"
              />
            </div>

            {/* Bottom actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => setMode("comparison")}
                className="px-5 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium text-[#07172D] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saved}
                className="px-5 py-2.5 rounded-lg bg-[#07172D] text-white text-sm font-semibold hover:bg-[#0f2a4a] transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {saved ? (
                  <>
                    <Check className="w-4 h-4" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save changes
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
