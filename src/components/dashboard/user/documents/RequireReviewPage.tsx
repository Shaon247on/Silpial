"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
import type { LawUploadResult, AnalysisSection } from "@/actions/user/doc.action";

const fade = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

function statusLabel(status: string) {
  if (status === "Issues detected") return "Problemas detectados";
  if (status === "Missing") return "Sección faltante";
  if (status === "OK") return "Correcto";
  return status;
}

function statusColors(status: string) {
  if (status === "Issues detected") return "bg-amber-100 text-amber-700 border-amber-200";
  if (status === "Missing") return "bg-red-100 text-red-700 border-red-200";
  if (status === "OK") return "bg-emerald-100 text-emerald-700 border-emerald-200";
  return "bg-gray-100 text-gray-600 border-gray-200";
}

function statusIcon(status: string) {
  if (status === "Issues detected") return <AlertTriangle className="w-4 h-4" />;
  if (status === "Missing") return <AlertCircle className="w-4 h-4" />;
  return null;
}

export default function RequireReviewPage() {
  const params = useParams<{ docId: string; sectionId: string }>();
  const router = useRouter();
  const { docId, sectionId } = params ?? {};

  const [section, setSection] = useState<AnalysisSection | null>(null);
  const [docTitle, setDocTitle] = useState<string>("Documento");
  const [copied, setCopied] = useState(false);

  // Load section from sessionStorage
  useEffect(() => {
    if (!docId || !sectionId) return;
    const raw = sessionStorage.getItem(`doc_${docId}`);
    if (!raw) return;
    try {
      const doc = JSON.parse(raw) as LawUploadResult;
      setDocTitle(doc.title ?? "Documento");
      const found = doc.analysis_result?.sections?.find(
        (s) => s.section_id === sectionId
      );
      if (found) setSection(found);
    } catch {/* ignore */}
  }, [docId, sectionId]);

  const handleCopy = () => {
    if (!section?.suggested_changes) return;
    navigator.clipboard.writeText(section.suggested_changes).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  if (!section) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center text-sm text-gray-400">
        No se encontraron datos de la sección.{" "}
        <button
          onClick={() => router.back()}
          className="underline text-blue-600"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back nav */}
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <button
          onClick={() => router.push(`/dashboard/documents/${docId}`)}
          className="inline-flex items-center gap-2 text-sm text-[#4A5565] hover:text-[#07172D] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al documento
        </button>
      </motion.div>

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
            <h1 className="text-2xl font-bold text-[#07172D]">{section.section_name}</h1>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border mt-1 ${statusColors(
              section.status
            )}`}
          >
            {statusIcon(section.status)}
            {statusLabel(section.status)}
          </span>
        </div>
      </motion.div>

      {/* Review / Analysis */}
      <motion.div
        variants={fade}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.4, delay: 0.08 }}
        className="mb-5 p-5 rounded-xl border border-blue-200 bg-blue-50"
      >
        <div className="flex items-center gap-2 mb-3">
          <MessageSquareWarning className="w-5 h-5 text-blue-600 shrink-0" />
          <h2 className="text-sm font-semibold text-blue-700">Análisis de la IA</h2>
        </div>
        <p className="text-sm text-blue-800 leading-relaxed">{section.review}</p>
      </motion.div>

      {/* Section text — "Versión generada por IA" */}
      {section.section_text && (
        <motion.div
          variants={fade}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.4, delay: 0.14 }}
          className="mb-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-[#4A5565]" />
            <h2 className="text-sm font-semibold text-[#07172D]">Versión generada por IA</h2>
          </div>
          <div className="p-5 bg-white rounded-xl border border-gray-200">
            <p className="text-sm text-[#4A5565] leading-relaxed whitespace-pre-wrap">
              {section.section_text}
            </p>
          </div>
        </motion.div>
      )}

      {/* Suggested changes — "Versión sugerida por IA" */}
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
              <h2 className="text-sm font-semibold text-[#07172D]">Versión sugerida por IA</h2>
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

      {/* Missing section notice */}
      {section.status === "Missing" && !section.section_text && (
        <motion.div
          variants={fade}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.4, delay: 0.14 }}
          className="mb-5 p-5 rounded-xl border border-red-200 bg-red-50"
        >
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <h2 className="text-sm font-semibold text-red-700">Sección no encontrada en el documento</h2>
          </div>
          <p className="text-sm text-red-600 mt-1">
            Esta sección no existe en el documento original. Considera agregar el contenido
            sugerido para cumplir con los requisitos.
          </p>
        </motion.div>
      )}

      {/* Navigation between sections (optional footer) */}
      <motion.div
        variants={fade}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.4, delay: 0.28 }}
        className="mt-8 pt-5 border-t border-gray-100 flex justify-between"
      >
        <button
          onClick={() => router.push(`/dashboard/documents/${docId}`)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-sm font-medium text-[#07172D] rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al resumen
        </button>
      </motion.div>
    </div>
  );
}