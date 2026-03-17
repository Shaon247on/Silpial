"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FileText, AlertCircle, Plus } from "lucide-react";
import type { DocumentRow } from "@/actions/user/doc.action";

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function ComplianceScore({ score }: { score: number }) {
  const color =
    score >= 70
      ? "text-emerald-600 bg-emerald-50 border-emerald-200"
      : score >= 40
      ? "text-amber-600 bg-amber-50 border-amber-200"
      : "text-red-600 bg-red-50 border-red-200";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${color}`}
    >
      {score}%
    </span>
  );
}

const fade = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const ITEMS_PER_PAGE = 10;

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  rows: DocumentRow[];
  count: number;
  totalUploads: number;
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
  error?: string;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function DocumentsTable({
  rows,
  count,
  totalUploads,
  currentPage,
  hasNext,
  hasPrevious,
  error,
}: Props) {
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    router.push(`/dashboard/documents?page=${newPage}`);
  };

  return (
    <div className="max-w-7xl mx-auto">

      {/* Header */}
      <motion.div
        variants={fade}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.4 }}
        className="mb-6 flex items-start justify-between gap-4 flex-wrap"
      >
        <div>
          <h1 className="text-2xl font-bold text-[#07172D]">Documentos</h1>
          <p className="mt-1 text-sm text-[#4A5565]">
            Un registro completo de todas las acciones y decisiones para responsabilidad y transparencia.
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard/documents/new")}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#07172D] text-white text-sm font-medium rounded-lg hover:bg-[#0f2a4a] transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Nuevo documento
        </button>
      </motion.div>

      {/* Stats row */}
      <motion.div
        variants={fade}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.4, delay: 0.06 }}
        className="mb-6 flex items-center gap-6 flex-wrap"
      >
        <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-gray-200 shadow-sm">
          <FileText className="w-4 h-4 text-[#4A5565]" />
          <span className="text-sm text-[#4A5565]">Total documentos:</span>
          <span className="text-sm font-bold text-[#07172D]">{count}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-gray-200 shadow-sm">
          <FileText className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-[#4A5565]">Cargas totales:</span>
          <span className="text-sm font-bold text-[#07172D]">{totalUploads}</span>
        </div>
      </motion.div>

      {/* Info Banner */}
      <motion.div
        variants={fade}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.08 }}
        className="mb-6 flex items-start gap-3 px-5 py-4 rounded-xl border border-blue-200 bg-blue-50"
      >
        <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-700">Trazabilidad Completa de Actividades</p>
          <p className="text-sm text-blue-600 mt-0.5">
            Todas las actividades del sistema y decisiones del usuario se capturan para garantizar
            la trazabilidad completa y supervisión.
          </p>
        </div>
      </motion.div>

      {/* Error state */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-start gap-3 px-5 py-4 rounded-xl border border-red-200 bg-red-50"
        >
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-700">Error al cargar documentos</p>
            <p className="text-sm text-red-600 mt-0.5">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Table Card */}
      <motion.div
        variants={fade}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.16 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-[#07172D]">Historial completo</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {[
                  "Documento",
                  "Secciones",
                  "Marcadas",
                  "Faltantes",
                  "Fecha de carga",
                  "Puntuación de conformidad",
                  "Acciones",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#4A5565] first:pl-6 last:pr-6"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && !error ? (
                <tr>
                  <td colSpan={7} className="px-6 py-14 text-center text-sm text-gray-400">
                    No hay documentos cargados todavía.{" "}
                    <button
                      onClick={() => router.push("/dashboard/documents/new")}
                      className="underline text-blue-600"
                    >
                      Sube tu primer documento
                    </button>
                  </td>
                </tr>
              ) : (
                rows?.map((doc, idx) => (
                  <motion.tr
                    key={doc.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition-colors"
                  >
                    {/* Document name */}
                    <td className="px-5 py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-gray-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#07172D] truncate max-w-[180px]">
                            {doc.name}
                          </p>
                          <p className="text-xs text-gray-400 truncate max-w-[180px]">
                            {doc.fileName}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Total sections */}
                    <td className="px-5 py-4 text-sm text-[#07172D] font-medium">
                      {doc.sections}
                    </td>

                    {/* Flagged sections */}
                    <td className="px-5 py-4">
                      <span className={`text-sm font-medium ${doc.flaggedSections > 0 ? "text-amber-600" : "text-gray-400"}`}>
                        {doc.flaggedSections}
                      </span>
                    </td>

                    {/* Missing sections */}
                    <td className="px-5 py-4">
                      <span className={`text-sm font-medium ${doc.missingSections > 0 ? "text-red-600" : "text-gray-400"}`}>
                        {doc.missingSections}
                      </span>
                    </td>

                    {/* Upload date */}
                    <td className="px-5 py-4 text-sm text-[#4A5565] whitespace-nowrap">
                      {formatDate(doc.uploadedAt)}
                    </td>

                    {/* Compliance score */}
                    <td className="px-5 py-4">
                      <ComplianceScore score={doc.complianceScore} />
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4 pr-6">
                      <button
                        onClick={() =>
                          router.push(`/dashboard/documents/${doc.id}`)
                        }
                        className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Ver
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {(hasNext || hasPrevious) && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-[#4A5565]">
              Página {currentPage} · {count} documentos en total
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!hasPrevious}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                Anterior
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!hasNext}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}