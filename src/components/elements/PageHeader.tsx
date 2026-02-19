"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Plus } from "lucide-react";

interface PageHeaderProps {
  username?: string;
  subtitle?: string;
  showCreateButton?: boolean;
  title?: string;
}

export default function PageHeader({
  username = "Silpial",
  subtitle = "Manage your tender documents with clarity and compliance.",
  showCreateButton = false,
  title,
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4"
    >
      <div>
        <h1 className="text-2xl font-bold text-[#07172D] tracking-tight">
          {title ?? `Welcome back, ${username}`}
        </h1>
        <p className="mt-1 text-sm text-[#4A5565]">{subtitle}</p>
      </div>

      {showCreateButton && (
        <Link
          href="/dashboard/documents/new"
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#07172D] text-white text-sm font-medium rounded-lg hover:bg-[#0f2a4a] active:scale-95 transition-all duration-200 shrink-0 self-start"
        >
          <Plus className="w-4 h-4" />
          Create new document
        </Link>
      )}
    </motion.div>
  );
}