"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { StepStatus } from "@/types/index.type";
import { analysisSteps } from "@/data/indexData";


interface StepState {
  id: number;
  status: StepStatus;
}

export default function AiCheckingDocPage() {
  const router = useRouter();
  const [steps, setSteps] = useState<StepState[]>(
    analysisSteps.map((s) => ({ id: s.id, status: "pending" as StepStatus }))
  );
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const runSteps = async () => {
      for (let i = 0; i < analysisSteps.length; i++) {
        if (cancelled) return;

        // Mark as in-progress
        setSteps((prev) =>
          prev.map((s) => (s.id === analysisSteps[i].id ? { ...s, status: "in-progress" } : s))
        );

        await new Promise((r) => setTimeout(r, analysisSteps[i].durationMs));

        if (cancelled) return;

        // Mark as complete
        setSteps((prev) =>
          prev.map((s) => (s.id === analysisSteps[i].id ? { ...s, status: "complete" } : s))
        );

        await new Promise((r) => setTimeout(r, 300));
      }

      if (!cancelled) {
        setDone(true);
        setTimeout(() => router.push("/dashboard/documents/doc1"), 1000);
      }
    };

    runSteps();
    return () => { cancelled = true; };
  }, [router]);

  const getStep = (id: number): StepStatus =>
    steps.find((s) => s.id === id)?.status ?? "pending";

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-[#07172D]">Analyze your document</h1>
        <p className="mt-1 text-sm text-[#4A5565]">
          This process typically takes 2–3 minutes for standard tender documents.
        </p>
      </motion.div>

      {/* Steps */}
      <div className="flex flex-col gap-3">
        {analysisSteps.map((step, idx) => {
          const status = getStep(step.id);

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={status}
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 1 }}
                  className={`flex items-center gap-4 p-5 rounded-xl border transition-all duration-500 ${
                    status === "complete"
                      ? "bg-emerald-50 border-emerald-200"
                      : status === "in-progress"
                      ? "bg-blue-50 border-blue-300"
                      : "bg-white border-gray-200"
                  }`}
                >
                  {/* Icon / Badge */}
                  <div className="shrink-0">
                    {status === "complete" ? (
                      <motion.div
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                      </motion.div>
                    ) : status === "in-progress" ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                      >
                        <Loader2 className="w-7 h-7 text-blue-500" />
                      </motion.div>
                    ) : (
                      <div className="w-7 h-7 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-400">{step.id}</span>
                      </div>
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-semibold ${
                        status === "complete"
                          ? "text-emerald-700"
                          : status === "in-progress"
                          ? "text-blue-700"
                          : "text-[#07172D]"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-[#4A5565] mt-0.5">{step.description}</p>
                  </div>

                  {/* Status label */}
                  <div className="shrink-0">
                    {status === "complete" && (
                      <span className="text-xs font-semibold text-emerald-600">Complete</span>
                    )}
                    {status === "in-progress" && (
                      <motion.span
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ repeat: Infinity, duration: 1.4 }}
                        className="text-xs font-semibold text-blue-600"
                      >
                        In progress…
                      </motion.span>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Done indicator */}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex items-center justify-center gap-2 text-emerald-600 text-sm font-medium"
          >
            <CheckCircle2 className="w-4 h-4" />
            Analysis complete! Redirecting…
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}