"use client"
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FAQItem } from "@/types/FAQ.type";

export default function AccordionItem({ item, index }: { item: FAQItem; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: "easeOut" }}
      className="rounded-xl border overflow-hidden"
      style={{
        borderColor: open ? "#07162D" : "#E5E7EB",
        boxShadow: open ? "0 4px 20px rgba(7,22,45,0.07)" : "none",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left focus:outline-none"
        style={{ backgroundColor: open ? "#07162D" : "white", transition: "background-color 0.2s ease" }}
      >
        <span
          className="text-sm font-semibold leading-snug"
          style={{ color: open ? "white" : "#07162D" }}
        >
          {item.q}
        </span>
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="flex-shrink-0"
          style={{ color: open ? "rgba(255,255,255,0.5)" : "#BDBDBD" }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M12 4v16m8-8H4" />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-5 pt-4 pb-5 border-t border-gray-100">
              <p className="text-sm leading-relaxed" style={{ color: "#424242" }}>
                {item.a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}