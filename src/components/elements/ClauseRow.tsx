import { Clause } from "@/types/index.type";
import { motion } from "framer-motion";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  FileText,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import { Button } from "../ui/button";

export function ClauseRow({
  clause,
  idx,
  onReview,
}: {
  clause: Clause;
  idx: number;
  onReview: () => void;
}) {
  const needsReview =
    clause.status === "outdated" ||
    clause.status === "missing" ||
    clause.status === "wrong";

  return (
    <motion.tr
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.04 }}
      className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition-colors"
    >
      {/* Clause Name */}
      <td className="px-5 py-4 pl-6">
        <div>
          <p className="text-sm font-medium text-[#000000]">{clause.title}</p>
          <p className="text-xs text-[#4A5565] mt-0.5">{clause.legalRef}</p>
          {clause.foundIn && (
            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
              <FileText className="w-3 h-3" /> Found in: {clause.foundIn}
            </p>
          )}
        </div>
      </td>

      {/* Category */}
      <td className="px-5 py-4">
        <span className="text-sm text-[#000000] whitespace-nowrap">
          {clause.category}
        </span>
      </td>

      {/* Status */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-1.5">
          {clause.status === "present" && (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          )}
          {clause.status === "outdated" && (
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          )}
          {clause.status === "missing" && (
            <AlertCircle className="w-4 h-4 text-amber-600" />
          )}
          <StatusBadge status={clause.status} />
        </div>
        {/* Warning callout */}
        {needsReview && clause.explanation && (
          <div className="mt-2 flex items-start gap-1.5 px-3 py-2 rounded-lg border border-amber-200 bg-amber-50 max-w-xs">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
            <span className="text-xs text-amber-700">{clause.explanation}</span>
          </div>
        )}
      </td>

      {/* AI Explanation */}
      <td className="px-5 py-4 max-55">
        <p className="text-sm text-[#4A5565] line-clamp-2">
          {clause.explanation}
        </p>
      </td>

      {/* Action */}
      <td className="px-5 py-4 pr-6">
        {needsReview ? (
          <Button
            onClick={onReview}
            className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors whitespace-nowrap"
          >
            Review
          </Button>
        ) : (
          <span className="text-sm text-gray-300">—</span>
        )}
      </td>
    </motion.tr>
  );
}
