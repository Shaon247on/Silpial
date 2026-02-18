"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Upload Documents",
    shortDesc: "Securely upload existing tender documents or start from official templates.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
    expandedContent: {
      detail:
        "Our secure upload system accepts both Word (.docx) and PDF formats, supporting large tender files between 25 and 890 pages. Documents are encrypted in transit and at rest using AES-256 encryption — fully compliant with EU data protection regulations.",
      bullets: [
        "Drag-and-drop or browse to upload",
        "Supports Word (.docx) and PDF formats",
        "Handles large files up to 890 pages",
        "End-to-end AES-256 encryption",
        "Or start fresh from official government templates",
      ],
      badge: "Secure & Fast",
    },
  },
  {
    number: "02",
    title: "AI Analysis & Comparison",
    shortDesc: "The system analyzes structure and clauses, comparing them with successful public tenders from Spanish administrations.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    expandedContent: {
      detail:
        "RedactAI cross-references your document against thousands of approved Spanish public tenders, identifying clause gaps, regulatory mismatches, and structural weaknesses. Every analysis is grounded in the Official State Gazette (BOE) and the Government Procurement Portal — no hallucinations, no guesswork.",
      bullets: [
        "Clause-by-clause structural analysis",
        "Cross-referenced with the Official State Gazette (BOE)",
        "Benchmarked against successful tender precedents",
        "Flags missing mandatory sections automatically",
        "Detects ambiguous language that may invite legal challenge",
      ],
      badge: "Powered by Official Sources",
    },
  },
  {
    number: "03",
    title: "Review Suggestions",
    shortDesc: "Side-by-side comparison of original text and AI suggestions — you decide.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    expandedContent: {
      detail:
        "You remain in full control at every step. Each AI suggestion is displayed alongside the original text with a plain-language explanation of why the change is recommended and which legal provision it references. Accept, edit inline, or reject — nothing is applied automatically.",
      bullets: [
        "Side-by-side original vs. suggested text view",
        "Plain-language rationale for every suggestion",
        "Legal reference cited for each recommendation",
        "Accept, edit, or reject each change individually",
        "Full audit log of every decision you make",
      ],
      badge: "You Stay in Control",
    },
  },
  {
    number: "04",
    title: "Export",
    shortDesc: "Download your finalized, compliant document ready for official submission.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
    expandedContent: {
      detail:
        "Once you've reviewed and approved all changes, export your document in Word format — preserving all original formatting, headers, and clause numbering. The export includes a compliance summary report and a timestamped change log you can submit alongside the tender.",
      bullets: [
        "Export as Word (.docx) preserving all formatting",
        "Compliance summary report included",
        "Timestamped audit trail of accepted changes",
        "Ready for official portal submission",
        "Re-export anytime if further edits are needed",
      ],
      badge: "Submission Ready",
    },
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
};

export default function Safe() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto" ref={ref}>
        {/* Header */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-14"
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
            style={{ color: "#07162D", fontFamily: "'Georgia', serif", letterSpacing: "-0.02em" }}
          >
            A Safer, More Efficient Way
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-4 text-sm sm:text-base max-w-xl mx-auto leading-relaxed"
            style={{ color: "#424242" }}
          >
            Four simple steps to go from raw document to a legally confident, submission-ready tender.
          </motion.p>
        </motion.div>

        {/* Accordion steps */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col gap-3"
        >
          {steps.map((step, i) => {
            const isOpen = openIndex === i;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -24 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.11 }}
                className="rounded-2xl border overflow-hidden"
                style={{
                  borderColor: isOpen ? "#07162D" : "#BDBDBD",
                  boxShadow: isOpen ? "0 8px 32px rgba(7,22,45,0.10)" : "none",
                  transition: "border-color 0.25s ease, box-shadow 0.25s ease",
                }}
              >
                {/* Trigger row */}
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center gap-4 sm:gap-5 px-5 sm:px-6 py-4 sm:py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#07162D] focus-visible:ring-offset-2"
                  style={{
                    backgroundColor: isOpen ? "#07162D" : "white",
                    transition: "background-color 0.25s ease",
                  }}
                  aria-expanded={isOpen}
                >
                  {/* Step number */}
                  <div
                    className="flex-shrink-0 text-2xl sm:text-3xl font-bold leading-none select-none"
                    style={{
                      color: isOpen ? "rgba(255,255,255,0.2)" : "#BDBDBD",
                      fontFamily: "'Georgia', serif",
                      minWidth: 36,
                      transition: "color 0.25s ease",
                    }}
                  >
                    {step.number}
                  </div>

                  {/* Divider */}
                  <div
                    className="w-px self-stretch flex-shrink-0 rounded-full"
                    style={{
                      backgroundColor: isOpen ? "rgba(255,255,255,0.15)" : "#BDBDBD",
                      transition: "background-color 0.25s ease",
                    }}
                  />

                  {/* Icon + title + short desc */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: isOpen ? "rgba(255,255,255,0.12)" : "#EEEEEE",
                        color: isOpen ? "white" : "#07162D",
                        transition: "background-color 0.25s ease, color 0.25s ease",
                      }}
                    >
                      {step.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-sm sm:text-base font-semibold leading-snug"
                        style={{
                          color: isOpen ? "white" : "#07162D",
                          transition: "color 0.25s ease",
                        }}
                      >
                        {step.title}
                      </h3>
                      <AnimatePresence>
                        {!isOpen && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-xs mt-0.5 truncate hidden sm:block"
                            style={{ color: "#797979" }}
                          >
                            {step.shortDesc}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Animated chevron */}
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flex-shrink-0"
                    style={{ color: isOpen ? "rgba(255,255,255,0.5)" : "#BDBDBD" }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </button>

                {/* Animated expanded panel */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="panel"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      <div
                        className="px-5 sm:px-6 pt-5 pb-6 bg-white border-t"
                        style={{ borderColor: "#EEEEEE" }}
                      >
                        {/* Badge */}
                        <div className="mb-3">
                          <span
                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
                            style={{ backgroundColor: "rgba(7,22,45,0.06)", color: "#07162D" }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#07162D] inline-block" />
                            {step.expandedContent.badge}
                          </span>
                        </div>

                        {/* Detail paragraph */}
                        <p className="text-sm leading-relaxed mb-5" style={{ color: "#424242" }}>
                          {step.expandedContent.detail}
                        </p>

                        {/* Bullet list — staggered in */}
                        <ul className="flex flex-col gap-2.5">
                          {step.expandedContent.bullets.map((b, j) => (
                            <motion.li
                              key={j}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                delay: 0.06 + j * 0.07,
                                duration: 0.32,
                                ease: "easeOut",
                              }}
                              className="flex items-start gap-2.5 text-sm"
                              style={{ color: "#424242" }}
                            >
                              <svg
                                className="w-4 h-4 flex-shrink-0 mt-0.5"
                                fill="none"
                                stroke="#07162D"
                                strokeWidth="2.5"
                                viewBox="0 0 24 24"
                              >
                                <path d="M5 13l4 4L19 7" />
                              </svg>
                              {b}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}