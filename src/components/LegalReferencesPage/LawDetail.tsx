"use client";

import { LegalReference } from "@/types/law.type";
import { motion } from "framer-motion";

interface LawDetailProps {
  reference: LegalReference;
  onClose: () => void;
}

export default function LawDetail({ reference, onClose }: LawDetailProps) {
  return (
    <motion.div
      key={reference.id}
      initial={{ opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 32 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex flex-col-reverse md:flex-row items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <h2
            className="text-base font-bold leading-snug"
            style={{ color: "#07162D" }}
          >
            {reference.title}
          </h2>
          <div className="flex items-center gap-1.5 mt-2">
            <svg
              className="w-3.5 h-3.5 shrink-0"
              style={{ color: "#9CA3AF" }}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs" style={{ color: "#9CA3AF" }}>
              Updated: {reference.updatedAt}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end w-full md:w-auto gap-2 shrink-0">
          {/* Download */}
          <button
            className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#07162D] hover:border-[#07162D] transition-colors duration-200"
            title="Download"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>

          {/* Close / collapse */}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-300 transition-colors duration-200"
            title="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 mb-5" />

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pr-1">
        {/* Intro text */}
        <p
          className="text-sm leading-relaxed mb-6"
          style={{ color: "#374151" }}
        >
          {reference.fullText}
        </p>

        {/* Articles */}
        <div className="flex flex-col gap-6">
          {reference.articles.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.4, ease: "easeOut" }}
            >
              <h3
                className="text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: "#07162D" }}
              >
                {article.heading}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#374151" }}
              >
                {article.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}