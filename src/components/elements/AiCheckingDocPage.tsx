"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import type { LawUploadResponse } from "@/actions/lawDocument.action";

// Step labels matching the backend steps (in Spanish)
const UI_STEPS = [
  {
    id: 1,
    title: "Análisis de estructura",
    description: "Identificando secciones, encabezados y organización general del documento.",
  },
  {
    id: 2,
    title: "Revisión de secciones y cláusulas",
    description: "Identificando cláusulas individuales para comprobar su completitud y claridad.",
  },
  {
    id: 3,
    title: "Comparación con documentos de referencia",
    description: "Cotejando con plantillas y ejemplos previos de licitaciones exitosas.",
  },
  {
    id: 4,
    title: "Verificación de cumplimiento",
    description: "Comprobando requisitos obligatorios y obligaciones legales.",
  },
  {
    id: 5,
    title: "Análisis de cumplimiento con IA",
    description: "Generando informe estructurado de cumplimiento mediante inteligencia artificial.",
  },
];

type StepStatus = "pending" | "in-progress" | "complete";

export default function AiCheckingDocPage() {
  const router = useRouter();
  const [stepStatuses, setStepStatuses] = useState<StepStatus[]>(
    UI_STEPS.map(() => "pending")
  );
  const [apiError, setApiError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animFrameRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentStepRef = useRef(0);

  // Animate steps while waiting for the API
  useEffect(() => {
    // Advance one step every ~2.5 s until step 4 (leave step 5 for when API returns)
    animFrameRef.current = setInterval(() => {
      const cur = currentStepRef.current;
      if (cur >= UI_STEPS.length - 1) {
        // Hold on last step spinning until API responds
        setStepStatuses((prev) => {
          const next = [...prev];
          next[cur] = "in-progress";
          return next;
        });
        if (animFrameRef.current) clearInterval(animFrameRef.current);
        return;
      }
      setStepStatuses((prev) => {
        const next = [...prev];
        if (cur > 0) next[cur - 1] = "complete";
        next[cur] = "in-progress";
        return next;
      });
      currentStepRef.current = cur + 1;
    }, 2500);

    return () => {
      if (animFrameRef.current) clearInterval(animFrameRef.current);
    };
  }, []);

  // Poll sessionStorage for the API result
  useEffect(() => {
    pollRef.current = setInterval(() => {
      const status = sessionStorage.getItem("law_upload_status");

      if (status === "done") {
        if (pollRef.current) clearInterval(pollRef.current);
        if (animFrameRef.current) clearInterval(animFrameRef.current);

        // Mark all steps complete
        setStepStatuses(UI_STEPS.map(() => "complete"));
        setDone(true);

        const raw = sessionStorage.getItem("law_upload_result");
        if (raw) {
          try {
            const result = JSON.parse(raw) as { success: boolean; data?: LawUploadResponse };
            sessionStorage.removeItem("law_upload_result");
            sessionStorage.removeItem("law_upload_status");

            if (result.success && result.data?.results?.[0]) {
              const docId = result.data.results[0].document_id;
              // Store full analysis for the details page
              sessionStorage.setItem(`doc_${docId}`, JSON.stringify(result.data.results[0]));
              setTimeout(() => router.push(`/dashboard/documents/${docId}`), 1000);
            } else {
              setTimeout(() => router.push("/dashboard/documents"), 1000);
            }
          } catch {
            setTimeout(() => router.push("/dashboard/documents"), 1000);
          }
        }
      } else if (status === "error") {
        if (pollRef.current) clearInterval(pollRef.current);
        if (animFrameRef.current) clearInterval(animFrameRef.current);

        const raw = sessionStorage.getItem("law_upload_result");
        if (raw) {
          const result = JSON.parse(raw) as { success: boolean; error?: string };
          setApiError(result.error ?? "Error al procesar el documento.");
        }
        sessionStorage.removeItem("law_upload_result");
        sessionStorage.removeItem("law_upload_status");
      }
    }, 800);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [router]);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-[#07172D]">Analizando tu documento</h1>
        <p className="mt-1 text-sm text-[#4A5565]">
          Este proceso puede tardar varios minutos según el tamaño del documento.
        </p>
      </motion.div>

      {/* Error banner */}
      {apiError && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-start gap-3 px-5 py-4 rounded-xl border border-red-200 bg-red-50"
        >
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-700">Error al analizar el documento</p>
            <p className="text-sm text-red-600 mt-0.5">{apiError}</p>
            <button
              onClick={() => router.push("/dashboard/documents/new")}
              className="mt-2 text-xs font-medium text-red-700 underline"
            >
              Volver e intentar de nuevo
            </button>
          </div>
        </motion.div>
      )}

      {/* Steps */}
      <div className="flex flex-col gap-3">
        {UI_STEPS.map((step, idx) => {
          const status = stepStatuses[idx];

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
            >
              <div
                className={`flex items-center gap-4 p-5 rounded-xl border transition-all duration-500 ${
                  status === "complete"
                    ? "bg-emerald-50 border-emerald-200"
                    : status === "in-progress"
                    ? "bg-blue-50 border-blue-300"
                    : "bg-white border-gray-200"
                }`}
              >
                {/* Icon */}
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
                    <span className="text-xs font-semibold text-emerald-600">Completado</span>
                  )}
                  {status === "in-progress" && (
                    <motion.span
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ repeat: Infinity, duration: 1.4 }}
                      className="text-xs font-semibold text-blue-600"
                    >
                      En proceso…
                    </motion.span>
                  )}
                  {status === "pending" && (
                    <span className="text-xs text-gray-400">Pendiente</span>
                  )}
                </div>
              </div>
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
            ¡Análisis completado! Redirigiendo…
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}