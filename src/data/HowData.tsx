import { motion } from "framer-motion";
export const steps = [
  {
    number: "01",
    label: "Upload",
    title: "Upload Your Tender Document",
    summary: "Start with what you have — or from an official template.",
    description:
      "Drag and drop your existing Word (.docx) or PDF tender documents into RedactAI. Our platform handles everything from small 25-page specifications to complex 890-page framework contracts. You can also choose from a library of official Spanish government templates to start fresh.",
    features: [
      "Supports Word (.docx) and PDF formats",
      "Large file support up to 890 pages",
      "AES-256 end-to-end encryption",
      "Official government template library",
    ],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
    visual: (
      <div className="bg-[#f7f8fa] rounded-2xl border border-gray-100 p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-[#07162D]">Upload Document</span>
          <span className="text-[10px] text-gray-400">Max 890 pages</span>
        </div>
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center gap-2 bg-white">
          <div className="w-10 h-10 rounded-full bg-[#07162D]/5 flex items-center justify-center">
            <svg className="w-5 h-5 text-[#07162D]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p className="text-xs text-gray-500 text-center">Drop your file here or <span className="text-[#07162D] font-medium">browse</span></p>
          <p className="text-[10px] text-gray-400">.docx, .pdf supported</p>
        </div>
        <div className="flex gap-2">
          {["Template A", "Template B", "Template C"].map((t) => (
            <div key={t} className="flex-1 rounded-lg bg-white border border-gray-200 p-2 text-center">
              <div className="w-4 h-4 rounded bg-[#07162D]/10 mx-auto mb-1" />
              <p className="text-[9px] text-gray-500">{t}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    number: "02",
    label: "Analysis",
    title: "AI Analyses Your Document",
    summary: "Deep clause-by-clause analysis grounded in official sources.",
    description:
      "RedactAI reads every clause and section of your document, cross-referencing it against thousands of approved Spanish public tenders and the Official State Gazette (BOE). It identifies gaps, regulatory mismatches, and language that could expose the tender to legal challenge — all in minutes.",
    features: [
      "Clause-by-clause structural analysis",
      "Cross-referenced with BOE and PLACE portal",
      "Flags missing mandatory sections",
      "Detects legally ambiguous language",
    ],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    visual: (
      <div className="bg-[#f7f8fa] rounded-2xl border border-gray-100 p-5 flex flex-col gap-3">
        <span className="text-xs font-semibold text-[#07162D]">Analysis in progress…</span>
        {[
          { label: "Clause structure", pct: 100, done: true },
          { label: "BOE cross-reference", pct: 78, done: false },
          { label: "Missing sections", pct: 45, done: false },
        ].map((item) => (
          <div key={item.label}>
            <div className="flex justify-between mb-1">
              <span className="text-[10px] text-gray-500">{item.label}</span>
              <span className="text-[10px] font-medium" style={{ color: item.done ? "#16a34a" : "#07162D" }}>{item.pct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: item.done ? "#16a34a" : "#07162D" }}
                initial={{ width: 0 }}
                whileInView={{ width: `${item.pct}%` }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                viewport={{ once: true }}
              />
            </div>
          </div>
        ))}
        <div className="mt-1 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2 flex items-start gap-2">
          <svg className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <p className="text-[10px] text-blue-600">3 issues detected — review required</p>
        </div>
      </div>
    ),
  },
  {
    number: "03",
    label: "Review",
    title: "Review Every Suggestion Manually",
    summary: "You approve. You reject. Nothing changes automatically.",
    description:
      "Each AI suggestion is shown side-by-side with your original text along with a plain-language explanation and the specific law or article it references. Accept it as-is, edit it inline, or reject it entirely. Every decision is logged in a full audit trail.",
    features: [
      "Side-by-side original vs. suggested text",
      "Legal citation for every suggestion",
      "Accept, edit inline, or reject",
      "Full timestamped audit log",
    ],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    visual: (
      <div className="bg-[#f7f8fa] rounded-2xl border border-gray-100 p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#07162D]">Suggestion Detected</span>
          <span className="text-[10px] text-gray-400">2 of 5</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-red-50 border border-red-100 p-2.5">
            <p className="text-[9px] font-semibold text-red-400 uppercase tracking-wide mb-1">Original</p>
            <p className="text-[10px] text-gray-600 leading-relaxed">The contractor shall deliver works within a reasonable timeframe…</p>
          </div>
          <div className="rounded-lg bg-green-50 border border-green-100 p-2.5">
            <p className="text-[9px] font-semibold text-green-500 uppercase tracking-wide mb-1">Suggested</p>
            <p className="text-[10px] text-gray-600 leading-relaxed">The contractor shall deliver works within 90 calendar days per Art. 29 Law 9/2017…</p>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
          <p className="text-[9px] text-gray-400 mb-0.5">Legal reference</p>
          <p className="text-[10px] font-medium text-[#07162D]">Clause 4.2 requires per law 9/2017…</p>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 rounded-lg bg-[#07162D] text-white text-[10px] font-semibold py-1.5 text-center">Accept</div>
          <div className="flex-1 rounded-lg border border-gray-300 text-gray-500 text-[10px] py-1.5 text-center">Edit</div>
          <div className="flex-1 rounded-lg border border-gray-300 text-gray-500 text-[10px] py-1.5 text-center">Reject</div>
        </div>
      </div>
    ),
  },
  {
    number: "04",
    label: "Export",
    title: "Export a Submission-Ready Document",
    summary: "Download your finalized tender, ready for official portal submission.",
    description:
      "Once you've approved all changes, export your document in Word format. All original formatting, clause numbering, and headers are preserved. Your download includes a compliance summary report and a timestamped audit log — both of which can be submitted alongside the tender if required.",
    features: [
      "Word (.docx) export preserving all formatting",
      "Compliance summary report included",
      "Timestamped audit trail of changes",
      "Re-export anytime after further edits",
    ],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
    visual: (
      <div className="bg-[#f7f8fa] rounded-2xl border border-gray-100 p-5 flex flex-col gap-3">
        <span className="text-xs font-semibold text-[#07162D]">Export Ready</span>
        <div className="rounded-xl bg-white border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#07162D] truncate">Tender_Final_v2.docx</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Compliant · 142 pages · 2.4 MB</p>
          </div>
          <div className="w-7 h-7 rounded-lg bg-[#07162D] flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
        </div>
        {[
          { label: "Compliance Report", color: "bg-green-50 border-green-100 text-green-700" },
          { label: "Audit Trail Log", color: "bg-amber-50 border-amber-100 text-amber-700" },
        ].map((item) => (
          <div key={item.label} className={`rounded-lg border px-3 py-2 flex items-center justify-between ${item.color}`}>
            <span className="text-[10px] font-medium">{item.label}</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
          </div>
        ))}
      </div>
    ),
  },
];

export const principles = [
  { icon: "🔒", title: "Official Sources Only", desc: "BOE, PLACE, and Government Procurement Portal — nothing else." },
  { icon: "👁️", title: "No Black Box", desc: "Every suggestion comes with a transparent explanation and legal citation." },
  { icon: "✋", title: "Human in Control", desc: "Zero automatic changes. Every edit requires your explicit approval." },
  { icon: "📋", title: "Full Audit Trail", desc: "Every decision is logged, timestamped, and exportable for compliance review." },
];
