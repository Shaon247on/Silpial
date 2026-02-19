"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Upload, Shield, FileText, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const fade = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function NewDocCreationPage() {
  const router = useRouter();
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      const allowed = [".docx", ".doc"];
      const ext = "." + file.name.split(".").pop()?.toLowerCase();
      if (!allowed.includes(ext)) {
        setError("Only .docx and .doc files are supported.");
        return;
      }
      if (file.size > 25 * 1024 * 1024) {
        setError("File size must be under 25 MB.");
        return;
      }
      setError(null);
      setUploading(true);
      // Simulate upload delay then go to AI processing
      setTimeout(() => router.push("/dashboard/documents/analyzing"), 1200);
    },
    [router]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        variants={fade}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-[#07172D]">Create a new document</h1>
        <p className="mt-1 text-sm text-[#4A5565]">
          Upload your tender document for analysis and compliance review.
        </p>
      </motion.div>

      {/* Upload Zone */}
      <motion.div
        variants={fade}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <label
          htmlFor="file-upload"
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cn(
            "flex flex-col items-center justify-center gap-4 w-full min-h-55 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200",
            dragging
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 bg-white hover:border-blue-300 hover:bg-gray-50",
            uploading && "pointer-events-none opacity-70"
          )}
        >
          <input
            id="file-upload"
            type="file"
            accept=".docx,.doc"
            className="hidden"
            onChange={onInputChange}
            disabled={uploading}
          />
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-md">
            <Upload className="w-7 h-7 text-white" />
          </div>
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-[#4A5565]">Uploading…</p>
            </div>
          ) : (
            <>
              <p className="text-sm font-medium text-[#07172D]">Drag your file to start uploading</p>
              <div className="flex items-center gap-3 w-32">
                <div className="flex-1 h-px bg-gray-300" />
                <span className="text-xs text-gray-400 font-medium">OR</span>
                <div className="flex-1 h-px bg-gray-300" />
              </div>
              <span className="px-5 py-2 bg-[#07172D] text-white text-sm font-medium rounded-lg hover:bg-[#0f2a4a] transition-colors">
                Browse files
              </span>
            </>
          )}
        </label>

        {error && (
          <div className="mt-3 flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </motion.div>

      {/* Security Notice */}
      <motion.div
        variants={fade}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mt-5 flex items-start gap-3 px-5 py-4 rounded-xl border border-blue-200 bg-blue-50"
      >
        <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-700">Documents are handled securely</p>
          <p className="text-sm text-blue-600 mt-0.5">
            All uploads are encrypted and stored in compliance with data protection regulations.
            Documents are accessible only to authorized users in your organization.
          </p>
        </div>
      </motion.div>

      {/* Option Cards */}
      <motion.div
        variants={fade}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.4, delay: 0.3 }}
        className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {[
          {
            icon: FileText,
            title: "Upload previous document",
            desc: "Upload an existing tender document for review and enhancement",
          },
          {
            icon: FileText,
            title: "Upload official template",
            desc: "Start with your organization's approved template",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="flex flex-col gap-2 p-5 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
          >
            <card.icon className="w-6 h-6 text-[#4A5565]" />
            <p className="font-semibold text-[#07172D] text-sm">{card.title}</p>
            <p className="text-sm text-[#4A5565]">{card.desc}</p>
          </div>
        ))}
      </motion.div>

      {/* Supported Formats */}
      <motion.div
        variants={fade}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.4, delay: 0.4 }}
        className="mt-4 p-5 bg-white rounded-xl border border-gray-200"
      >
        <p className="font-semibold text-[#07172D] text-sm mb-3">Supported formats and requirements</p>
        <ul className="space-y-1.5">
          {[
            "Microsoft documents (.docx, .doc)",
            "Supports long documents (25–60 pages typical)",
            "Maximum file size: 25 MB",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-[#4A5565]">
              <span className="w-2 h-2 rounded-full bg-gray-300 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}