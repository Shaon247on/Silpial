"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  FileText,
  AlertTriangle,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import type { LawUploadResult, AnalysisSection } from "@/actions/user/doc.action";

// ─── Types ─────────────────────────────────────────────────────────────────────

type FilterStatus = "all" | "Issues detected" | "Missing" | "OK";

// ─── Helpers ───────────────────────────────────────────────────────────────────

function statusLabel(status: string) {
  if (status === "Issues detected") return "Problemas detectados";
  if (status === "Missing") return "Faltante";
  if (status === "OK") return "Correcto";
  return status;
}

function statusColors(status: string) {
  if (status === "Issues detected") return "bg-amber-100 text-amber-700 border-amber-200";
  if (status === "Missing") return "bg-red-100 text-red-700 border-red-200";
  if (status === "OK") return "bg-emerald-100 text-emerald-700 border-emerald-200";
  return "bg-gray-100 text-gray-600 border-gray-200";
}

function paginate<T>(arr: T[], page: number, perPage: number): T[] {
  return arr.slice((page - 1) * perPage, page * perPage);
}

const ITEMS_PER_PAGE = 10;

const STATS = [
  {
    label: "Con problemas",
    key: "Issues detected" as const,
    icon: AlertTriangle,
    iconColor: "text-amber-500",
    valueColor: "text-amber-600",
    border: "border-amber-100",
  },
  {
    label: "Faltantes",
    key: "Missing" as const,
    icon: AlertCircle,
    iconColor: "text-red-500",
    valueColor: "text-red-600",
    border: "border-red-100",
  },
  {
    label: "Correctas",
    key: "OK" as const,
    icon: FileText,
    iconColor: "text-emerald-600",
    valueColor: "text-emerald-700",
    border: "border-emerald-100",
  },
];

// ─── Component ─────────────────────────────────────────────────────────────────

interface Props {
  doc: LawUploadResult;
}

export default function DocDetailsClient({ doc }: Props) {
  const router = useRouter();
  const docId = doc.document_id;
  const sections: AnalysisSection[] = doc.analysis_result?.sections ?? [];
  const summary = doc.analysis_result?.summary;

  // Persist sections in sessionStorage so the review page can read them
  // without needing its own API call (no per-section endpoint exists).
  useEffect(() => {
    sessionStorage.setItem(`doc_${docId}`, JSON.stringify(doc));
  }, [docId, doc]);

  // ── Filter / search / pagination state ────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return sections.filter((s) => {
      const matchSearch =
        s.section_name.toLowerCase().includes(search.toLowerCase()) ||
        s.section_id.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === "all" || s.status === filter;
      return matchSearch && matchFilter;
    });
  }, [sections, search, filter]);

  const paginated = useMemo(
    () => paginate(filtered, page, ITEMS_PER_PAGE),
    [filtered, page]
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const counts = useMemo(
    () => ({
      "Issues detected": sections.filter((s) => s.status === "Issues detected").length,
      Missing: sections.filter((s) => s.status === "Missing").length,
      OK: sections.filter((s) => s.status === "OK").length,
    }),
    [sections]
  );

  const handleFilterChange = (val: FilterStatus) => {
    setFilter(val);
    setPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const reviewExcerpt = (text: string) =>
    text.length > 110 ? text.slice(0, 110) + "…" : text;

  return (
    <div className="max-w-420 mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-[#07172D]">{doc.title}</h1>
        <p className="mt-1 text-sm text-[#4A5565]">
          Revisa los resultados del análisis antes de continuar.
        </p>
        {summary && (
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 border border-gray-200">
            <span className="text-xs text-[#4A5565]">Puntuación de cumplimiento:</span>
            <span
              className={`text-sm font-bold ${
                summary.compliance_score >= 70
                  ? "text-emerald-600"
                  : summary.compliance_score >= 40
                  ? "text-amber-600"
                  : "text-red-600"
              }`}
            >
              {summary.compliance_score}%
            </span>
          </div>
        )}
      </motion.div>

      {/* Stat cards */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
      >
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.07 }}
            onClick={() =>
              handleFilterChange(filter === stat.key ? "all" : stat.key)
            }
            className={`flex flex-col items-center gap-2 py-6 bg-white rounded-xl border ${
              stat.border
            } shadow-sm cursor-pointer hover:shadow-md transition-all ${
              filter === stat.key ? "ring-2 ring-offset-1 ring-blue-300" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              <span className={`text-base font-semibold ${stat.iconColor}`}>
                {stat.label}
              </span>
            </div>
            <span className={`text-3xl font-bold ${stat.valueColor}`}>
              {counts[stat.key]}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Table card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      >
        {/* Table toolbar */}
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-[#07172D] mb-4">
            Secciones y cláusulas requeridas
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar secciones…"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 bg-gray-50"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select
                value={filter}
                onChange={(e) => handleFilterChange(e.target.value as FilterStatus)}
                className="pl-9 pr-8 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 bg-gray-50 appearance-none cursor-pointer"
              >
                <option value="all">Todos los estados</option>
                <option value="Issues detected">Problemas detectados</option>
                <option value="Missing">Faltante</option>
                <option value="OK">Correcto</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {[
                  "Nombre de la sección",
                  "Estado",
                  "Resumen del análisis",
                  "Acción",
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
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-sm text-gray-400"
                  >
                    No hay secciones que coincidan con tu búsqueda o filtro.
                  </td>
                </tr>
              ) : (
                paginated.map((section, idx) => (
                  <motion.tr
                    key={section.section_id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    {/* Section name */}
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-[#07172D]">
                        {section.section_name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {section.section_id}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColors(
                          section.status
                        )}`}
                      >
                        {statusLabel(section.status)}
                      </span>
                    </td>

                    {/* Review excerpt */}
                    <td className="px-5 py-4 max-w-xs">
                      <p className="text-sm text-[#4A5565] leading-relaxed">
                        {reviewExcerpt(section.review)}
                      </p>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4 pr-6">
                      {(section.status === "Issues detected" ||
                        section.status === "Missing") ? (
                        <button
                          onClick={() =>
                            router.push(
                              `/dashboard/documents/${docId}/review/${section.section_id}`
                            )
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#07172D] text-white text-xs font-medium rounded-lg hover:bg-[#0f2a4a] transition-colors"
                        >
                          Revisar
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      ) : (
                        <span className="text-xs text-emerald-600 font-medium">
                          Sin cambios
                        </span>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-[#4A5565]">
              Mostrando {(page - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(page * ITEMS_PER_PAGE, filtered.length)} de{" "}
              {filtered.length}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                Anterior
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
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