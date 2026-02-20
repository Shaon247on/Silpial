"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { paginate } from "@/lib/utils";
import { dummyDocuments, ITEMS_PER_PAGE } from "@/data/indexData";
import { LawAlert } from "@/components/elements/LawAlert";
import Pagination from "@/components/elements/Pagination";
import ComplianceScore from "@/components/elements/ComplianceScore";
import PageHeader from "@/components/elements/PageHeader";

const fade = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function DocumentsTable() {
  const router = useRouter();
  const [page, setPage] = useState(1);

  // Simulate 24 total results by repeating dummy data
  const allDocs = useMemo(() => {
    const extended = [];
    for (let i = 0; i < Math.ceil(24 / dummyDocuments.length); i++) {
      extended.push(
        ...dummyDocuments.map((d, j) => ({ ...d, id: `${d.id}-${i}-${j}` })),
      );
    }
    return extended.slice(0, 24);
  }, []);

  const paginated = useMemo(
    () => paginate(allDocs, page, ITEMS_PER_PAGE),
    [allDocs, page],
  );

  return (
    <div className="max-w-480 mx-auto">
      {/* Header */}
      <PageHeader subtitle="Un registro completo de todas las acciones y decisiones para responsabilidad y transparencia" showCreateButton={true} title="Documentos"/>

      {/* Info Banner */}
      <motion.div
        variants={fade}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.08 }}
        className="mb-6"
      >
        <LawAlert
          title="Trazabilidad Completa de Actividades"
          subtitle="Todas las actividades del sistema y decisiones del usuario se capturan para garantizar la trazabilidad completa y supervisión."
        />
      </motion.div>

      {/* Table Card */}
      <motion.div
        variants={fade}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.16 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-[#07172D]">
            All History
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {[
                  "DOCUMENTO",
                  "SECCIONES",
                  "ÚLTIMA MODIFICACIÓN",
                  "Puntuación de Conformidad",
                  "ACCIONES",
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
              {paginated.map((doc, idx) => (
                <motion.tr
                  key={doc.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition-colors"
                >
                  <td className="px-5 py-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-gray-500" />
                      </div>
                      <span className="text-sm font-medium text-[#000000]">
                        {doc.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-[#000000]">
                    {doc.sections}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#000000] whitespace-nowrap">
                    {doc.lastModified}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#000000] whitespace-nowrap">
                    <ComplianceScore score={doc.complianceScore} />
                  </td>
                  <td className="px-5 py-4 pr-6">
                    <button
                      onClick={() =>
                        router.push(
                          `/dashboard/documents/${doc.id.split("-")[0]}`,
                        )
                      }
                      className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Ver
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-100">
          <Pagination
            page={page}
            total={allDocs.length}
            perPage={ITEMS_PER_PAGE}
            onChange={setPage}
          />
        </div>
      </motion.div>
    </div>
  );
}
