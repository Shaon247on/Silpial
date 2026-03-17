"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { ApiDocument } from "@/types/Document.type";

interface LawDetailProps {
  document: ApiDocument;
  onClose: () => void;
}

export default function LawDetail({ document, onClose }: LawDetailProps) {
  const pdfUrl = document.cloudinary_url;
  const [showViewer, setShowViewer] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 32 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      onAnimationComplete={() => setShowViewer(true)}
      className="flex h-full min-h-0 flex-col"
    >
      <div className="mb-4 flex flex-col-reverse items-start justify-between gap-4 md:flex-row">
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-bold leading-snug text-[#07162D]">
            {document.title}
          </h2>

          <div className="mt-2 flex items-center gap-1.5">
            <svg
              className="h-3.5 w-3.5 shrink-0 text-[#9CA3AF]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>

            <span className="text-xs text-[#9CA3AF]">
              Última actualización:{" "}
              {document.updated_at
                ? new Date(document.updated_at).toLocaleDateString("es-ES")
                : "N/A"}
            </span>
          </div>

          {document.category_name ? (
            <div className="mt-2">
              <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
                {document.category_name}
              </span>
            </div>
          ) : null}
        </div>

        <div className="flex w-full shrink-0 items-center justify-end gap-2 md:w-auto">
          {pdfUrl ? (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition-colors duration-200 hover:border-[#07162D] hover:text-[#07162D]"
              title="Open PDF"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M14 3h7v7m0-7L10 14" />
                <path d="M5 5v14h14" />
              </svg>
            </a>
          ) : null}

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition-colors duration-200 hover:border-red-300 hover:text-red-500"
            title="Close"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mb-5 border-t border-gray-100" />

      <div className="flex min-h-0 flex-1 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
        {!pdfUrl ? (
          <div className="flex h-full w-full items-center justify-center p-6 text-center">
            <p className="text-sm text-gray-400">
              No PDF file is available for this document.
            </p>
          </div>
        ) : !showViewer ? (
          <div className="flex h-full w-full items-center justify-center p-6 text-center">
            <p className="text-sm text-gray-400">Loading document preview...</p>
          </div>
        ) : (
          <iframe
            key={pdfUrl}
            src={pdfUrl}
            title={document.title}
            className="h-full w-full border-0"
          />
        )}
      </div>
    </motion.div>
  );
}