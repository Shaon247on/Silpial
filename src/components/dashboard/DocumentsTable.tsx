"use client";

import { motion, type Variants } from "framer-motion";
import { Eye, FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Document } from "@/types/Document.type";
import ComplianceScore from "../elements/ComplianceScore";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface DocumentsTableProps {
  documents: Document[];
  title?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export default function DocumentsTable({
  documents,
  title = "Recent documents",
}: DocumentsTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
      className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#07172D]">{title}</h2>
        <Link href={"/dashboard/documents"}>
        <Button className="bg-[#07172D]">
          View All
        </Button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-[#4A5565] pl-6 w-[35%]">
                Document
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-[#4A5565]">
                Section
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-[#4A5565]">
                Date
              </TableHead>
              {/* <TableHead className="text-xs font-semibold uppercase tracking-wider text-[#4A5565]">
                Status
              </TableHead> */}
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-[#4A5565]">
                Compliance Score (%)
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-[#4A5565] pr-6 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <motion.tbody
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {documents.map((doc) => (
              <motion.tr
                key={doc.id}
                variants={rowVariants}
                className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition-colors duration-150"
              >
                <TableCell className="pl-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="shrink-0 w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                      <FileText className="w-4 h-4 text-gray-500" />
                    </div>
                    <span className="text-sm font-medium text-[#000000] line-clamp-1">
                      {doc.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-4 text-sm text-gray-600 whitespace-nowrap">
                  {doc.sections}
                </TableCell>
                <TableCell className="py-4 text-sm text-gray-600 whitespace-nowrap">
                  {doc.lastModified}
                </TableCell>
                {/* <TableCell className="py-4">
                  <StatusBadge status={doc.status} />
                </TableCell> */}
                <TableCell className="py-4">
                  <ComplianceScore score={doc.complianceScore} />
                </TableCell>
                <TableCell className="py-4 pr-6 text-right">
                  <Button
                    aria-label={`View ${doc.name}`}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[#07172D] text-white hover:bg-[#0f2a4a] active:scale-95 transition-all duration-200 shadow-sm"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </motion.tr>
            ))}
          </motion.tbody>
        </Table>
      </div>
    </motion.div>
  );
}
