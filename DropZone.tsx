
"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, FileCheck2 } from "lucide-react"




interface DropZoneProps {
  value: File | null;
  onChange: (file: File | null) => void;
  error?: string;
}

export default function DropZone({ value, onChange, error }: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files?.length) return;
    onChange(files[0]);
  }, [onChange]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (value) {
    return (
      <div className={`rounded-xl border-2 px-4 py-4 flex items-center gap-3 bg-white transition-colors ${error ? "border-red-200 bg-red-50/30" : "border-[#07172D]/20 bg-[#07172D]/2"}`}>
        {/* PDF icon */}
        <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
          <FileCheck2 className="w-5 h-5 text-red-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-[#07172D] truncate">{value.name}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">{formatSize(value.size)} · PDF</p>
        </div>
        <button
          type="button"
          onClick={() => onChange(null)}
          className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center shrink-0 transition-colors"
        >
          <X className="w-3.5 h-3.5 text-gray-500" />
        </button>
      </div>
    );
  }

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={() => inputRef.current?.click()}
      className={`rounded-xl border-2 border-dashed px-6 py-8 flex flex-col items-center gap-3 cursor-pointer select-none transition-all duration-200 ${
        dragging
          ? "border-[#07172D] bg-[#07172D]/4 scale-[0.995]"
          : error
          ? "border-red-200 bg-red-50/30 hover:border-red-300"
          : "border-gray-200 bg-gray-50/50 hover:border-gray-300 hover:bg-gray-50"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Upload icon */}
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${dragging ? "bg-[#07172D]/10" : "bg-white border border-gray-200 shadow-sm"}`}>
        <Upload className={`w-6 h-6 transition-colors ${dragging ? "text-[#07172D]" : "text-gray-400"}`} />
      </div>

      <div className="text-center">
        <p className="text-[13px] font-semibold text-[#07172D]">
          {dragging ? "Drop your PDF here" : "Drag your file to start uploading"}
        </p>
        <p className="text-[12px] text-gray-400 mt-0.5">PDF files only · Max 20 MB</p>
      </div>

      <div className="flex items-center gap-3 w-full max-w-50">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-[11px] text-gray-400 font-medium">OR</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
        className="bg-[#07172D] hover:bg-[#0d2240] text-white text-[12px] font-semibold px-5 py-2 rounded-lg transition-colors"
      >
        Browse files
      </button>
    </div>
  );
}