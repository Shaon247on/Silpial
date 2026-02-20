"use client";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
interface VersionCardProps {
  label: string;
  text: string;
  selected: boolean;
  onAccept: () => void;
  acceptLabel: string;
}

export function VersionCard({
  label,
  text,
  selected,
  onAccept,
  acceptLabel,
}: VersionCardProps) {
  return (
    <motion.div
      animate={{
        borderColor: selected ? "#22c55e" : "#e5e7eb",
        boxShadow: selected ? "0 0 0 2px #bbf7d0" : "none",
      }}
      className="rounded-xl border bg-white overflow-hidden transition-all"
    >
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-[#07172D]">{label}</h3>
      </div>
      <div className="p-5 flex flex-col gap-5 min-h-50">
        <p className="text-sm text-gray-700 leading-relaxed flex-1 whitespace-pre-wrap">
          {text}
        </p>
        <button
          onClick={onAccept}
          className={`self-end flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            selected
              ? "bg-emerald-500 text-white hover:bg-emerald-600"
              : "bg-emerald-500 text-white hover:bg-emerald-600"
          }`}
        >
          <Check className="w-4 h-4" />
          {selected ? "Aceptado ✓" : acceptLabel}
        </button>
      </div>
    </motion.div>
  );
}
