"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Filter, FileText, AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react";

import { paginate } from "@/lib/utils";
import { dummyClauses, dummyDocuments, ITEMS_PER_PAGE } from "@/data/indexData";
import { Clause, FilterStatus } from "@/types/index.type";
import Pagination from "@/components/elements/Pagination";
import StatusBadge from "@/components/elements/StatusBadge";
import { Button } from "@/components/ui/button";
import { ClauseRow } from "@/components/elements/ClauseRow";

const fade = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const STATS = [
  {
    label: "Present",
    key: "present" as const,
    icon: FileText,
    iconColor: "text-gray-600",
    valueColor: "text-[#07172D]",
    border: "border-gray-200",
  },
  {
    label: "Outdated",
    key: "outdated" as const,
    icon: AlertTriangle,
    iconColor: "text-amber-500",
    valueColor: "text-amber-600",
    border: "border-amber-100",
  },
  {
    label: "Missing",
    key: "missing" as const,
    icon: AlertCircle,
    iconColor: "text-amber-500",
    valueColor: "text-amber-600",
    border: "border-amber-100",
  },
];

export default function DocDetailsPage() {
  const params = useParams<{ docId: string }>();
  const router = useRouter();
  const docId = params?.docId ?? "doc1";

  const doc = dummyDocuments.find((d) => d.id === docId) ?? dummyDocuments[0];
  const clauses = dummyClauses;

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return clauses.filter((c) => {
      const matchSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.category.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === "all" || c.status === filter;
      return matchSearch && matchFilter;
    });
  }, [clauses, search, filter]);

  const paginated = useMemo(() => paginate(filtered, page, ITEMS_PER_PAGE), [filtered, page]);

  const counts = useMemo(
    () => ({
      present: clauses.filter((c) => c.status === "present").length,
      outdated: clauses.filter((c) => c.status === "outdated").length,
      missing: clauses.filter((c) => c.status === "missing").length,
    }),
    [clauses]
  );

  const handleFilterChange = (val: FilterStatus) => {
    setFilter(val);
    setPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  return (
    <div className="max-w-480 mx-auto">
      {/* Header */}
      <motion.div
        variants={fade}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-[#07172D]">{doc.name}</h1>
        <p className="mt-1 text-sm text-[#4A5565]">Review the analysis results before proceeding.</p>
      </motion.div>

      {/* Stat Cards */}
      <motion.div
        variants={fade}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.4, delay: 0.08 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
      >
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.07 }}
            onClick={() => handleFilterChange(stat.key)}
            className={`flex flex-col items-center gap-2 py-6 bg-white rounded-xl border ${stat.border} shadow-sm cursor-pointer hover:shadow-md transition-all`}
          >
            <div className="flex items-center gap-2">
              <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              <span className={`text-base font-semibold ${stat.iconColor}`}>{stat.label}</span>
            </div>
            <span className={`text-3xl font-bold ${stat.valueColor}`}>
              {counts[stat.key]}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Table Card */}
      <motion.div
        variants={fade}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      >
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-[#07172D] mb-4">Required clauses and provisions</h2>

          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search clauses…"
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
                <option value="all">All statuses</option>
                <option value="present">Present</option>
                <option value="outdated">Outdated</option>
                <option value="missing">Missing</option>
                <option value="wrong">Wrong</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Clause Name", "Category", "Status", "AI Explanation", "Action"].map((h) => (
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
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-400">
                    No clauses match your search or filter.
                  </td>
                </tr>
              ) : (
                paginated.map((clause, idx) => (
                  <ClauseRow
                    key={clause.id}
                    clause={clause}
                    idx={idx}
                    onReview={() =>
                      router.push(`/dashboard/documents/${docId}/review/${clause.id}`)
                    }
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100">
          <Pagination
            page={page}
            total={filtered.length}
            perPage={ITEMS_PER_PAGE}
            onChange={setPage}
          />
        </div>
      </motion.div>
    </div>
  );
}
