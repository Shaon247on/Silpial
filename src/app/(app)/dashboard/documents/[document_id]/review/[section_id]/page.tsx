"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  AlertTriangle,
  AlertCircle,
  Copy,
  CheckCheck,
  FileText,
  Lightbulb,
  MessageSquareWarning,
} from "lucide-react";
import type {
  LawUploadResult,
  AnalysisSection,
} from "@/actions/user/doc.action";

const fade = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

// ─── Helpers ───────────────────────────────────────────────────────────────────

function statusLabel(status: string) {
  if (status === "Issues detected") return "Problemas detectados";
  if (status === "Missing") return "Sección faltante";
  if (status === "OK") return "Correcto";
  return status;
}

function statusColors(status: string) {
  if (status === "Issues detected")
    return "bg-amber-100 text-amber-700 border-amber-200";
  if (status === "Missing") return "bg-red-100 text-red-700 border-red-200";
  if (status === "OK")
    return "bg-emerald-100 text-emerald-700 border-emerald-200";
  return "bg-gray-100 text-gray-600 border-gray-200";
}

function statusIcon(status: string) {
  if (status === "Issues detected")
    return <AlertTriangle className="w-4 h-4" />;
  if (status === "Missing") return <AlertCircle className="w-4 h-4" />;
  return null;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function SectionReviewPage() {
  const params = useParams<{ document_id: string; section_id: string }>();
  const router = useRouter();
  const docId = params?.document_id ?? "";
  const sectionId = params?.section_id ?? "";

  const [section, setSection] = useState<AnalysisSection | null>(null);
  const [docTitle, setDocTitle] = useState<string>("Documento");
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  // Read section data from sessionStorage — seeded by DocDetailsClient on mount.
  // No extra API call needed since there is no per-section endpoint.
  useEffect(() => {
    if (!docId || !sectionId) return;

    const raw = sessionStorage.getItem(`doc_${docId}`);
    if (!raw) {
      setNotFound(true);
      return;
    }

    try {
      const doc = JSON.parse(raw) as LawUploadResult;
      setDocTitle(doc.title ?? "Documento");
      const found = doc.analysis_result?.sections?.find(
        (s) => s.section_id === sectionId,
      );
      if (found) {
        setSection(found);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    }
  }, [docId, sectionId]);

  const handleCopy = () => {
    if (!section?.suggested_changes) return;
    navigator.clipboard.writeText(section.suggested_changes).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  // ── Not found ─────────────────────────────────────────────────────────────────

  if (notFound) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center text-sm text-gray-400">
        No se encontraron datos de la sección.{" "}
        <button
          onClick={() => router.push(`/dashboard/documents/${docId}`)}
          className="underline text-blue-600"
        >
          Volver al documento
        </button>
      </div>
    );
  }

  // ── Loading ───────────────────────────────────────────────────────────────────

  if (!section) {
    return (
      <div className="max-w-3xl mx-auto py-20 flex justify-center">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────────

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        variants={fade}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <div className="flex items-start gap-3 flex-wrap">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[#4A5565] mb-1">{docTitle}</p>
            <h1 className="text-2xl font-bold text-[#07172D]">
              {section.section_name}
            </h1>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border mt-1 ${statusColors(section.status)}`}
          >
            {statusIcon(section.status)}
            {statusLabel(section.status)}
          </span>
        </div>
      </motion.div>

      {/* ── AI Analysis / Review ─────────────────────────────────────────────── */}
      <motion.div
        variants={fade}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.4, delay: 0.08 }}
        className="mb-5 p-5 rounded-xl border border-blue-200 bg-blue-50"
      >
        <div className="flex items-center gap-2 mb-3">
          <MessageSquareWarning className="w-5 h-5 text-blue-600 shrink-0" />
          <h2 className="text-sm font-semibold text-blue-700">
            Análisis de la IA
          </h2>
        </div>
        <p className="text-sm text-blue-800 leading-relaxed">
          {section.review}
        </p>
      </motion.div>

      {/* ── Versión generada por IA (section_text) ───────────────────────────── */}
      {section.section_text ? (
        <motion.div
          variants={fade}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.4, delay: 0.14 }}
          className="mb-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-[#4A5565]" />
            <h2 className="text-sm font-semibold text-[#07172D]">
              Versión generada por IA
            </h2>
          </div>
          <div className="p-5 bg-white rounded-xl border border-gray-200 max-h-72 overflow-y-auto">
            <p className="text-sm text-[#4A5565] leading-relaxed whitespace-pre-wrap">
              {section.section_text}
            </p>
          </div>
        </motion.div>
      ) : (
        /* Missing section — no original text to show */
        <motion.div
          variants={fade}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.4, delay: 0.14 }}
          className="mb-5 p-5 rounded-xl border border-red-200 bg-red-50"
        >
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <h2 className="text-sm font-semibold text-red-700">
              Sección no encontrada en el documento
            </h2>
          </div>
          <p className="text-sm text-red-600 mt-1">
            Esta sección no existe en el documento original. Considera agregar
            el contenido sugerido para cumplir con los requisitos.
          </p>
        </motion.div>
      )}

      {/* ── Versión sugerida por IA (suggested_changes) ──────────────────────── */}
      <AnimatePresence>
        {section.suggested_changes && (
          <motion.div
            variants={fade}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <h2 className="text-sm font-semibold text-[#07172D]">
                  Versión sugerida por IA
                </h2>
              </div>
              <button
                onClick={handleCopy}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  copied
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                    : "bg-white text-[#4A5565] border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {copied ? (
                  <>
                    <CheckCheck className="w-3.5 h-3.5" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copiar
                  </>
                )}
              </button>
            </div>
            <div className="p-5 bg-amber-50 rounded-xl border border-amber-200">
              <p className="text-sm text-[#07172D] leading-relaxed whitespace-pre-wrap">
                {section.suggested_changes}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
