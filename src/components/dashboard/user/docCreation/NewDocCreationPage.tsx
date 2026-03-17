"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Shield,
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LawUploadResponse, uploadLawDocumentAction } from "@/actions/user/doc.action";

// ─── Types ─────────────────────────────────────────────────────────────────────

type View = "upload" | "analyzing";
type StepStatus = "pending" | "in-progress" | "complete";

// ─── Step definitions ──────────────────────────────────────────────────────────

const STEPS = [
  {
    id: 1,
    title: "Análisis de estructura",
    description: "Identificando secciones, encabezados y organización general del documento.",
    durationMs: 3000,
  },
  {
    id: 2,
    title: "Revisión de secciones y cláusulas",
    description: "Identificando cláusulas individuales para comprobar su completitud y claridad.",
    durationMs: 3500,
  },
  {
    id: 3,
    title: "Comparación con documentos de referencia",
    description: "Cotejando con plantillas y ejemplos previos de licitaciones exitosas.",
    durationMs: 3000,
  },
  {
    id: 4,
    title: "Verificación de cumplimiento",
    description: "Comprobando requisitos obligatorios y obligaciones legales.",
    durationMs: 2500,
  },
  {
    id: 5,
    title: "Análisis de cumplimiento con IA",
    description:
      "Generando informe estructurado de cumplimiento mediante inteligencia artificial.",
    durationMs: null, // waits for real API response
  },
] as const;

// ─── Utilities ─────────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const waitFor = (predicate: () => boolean, intervalMs = 300) =>
  new Promise<void>((resolve) => {
    if (predicate()) { resolve(); return; }
    const id = setInterval(() => {
      if (predicate()) { clearInterval(id); resolve(); }
    }, intervalMs);
  });

// ─── Component ─────────────────────────────────────────────────────────────────

export default function NewDocPage() {
  const router = useRouter();

  // ── View state ────────────────────────────────────────────────────────────────
  const [view, setView] = useState<View>("upload");

  // ── Upload view ───────────────────────────────────────────────────────────────
  const [dragging, setDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // ── Analyzing view ────────────────────────────────────────────────────────────
  const [stepStatuses, setStepStatuses] = useState<StepStatus[]>(
    STEPS.map(() => "pending")
  );
  const [apiError, setApiError] = useState<string | null>(null);
  const [allDone, setAllDone] = useState(false);

  // Refs so the animation async loop reads fresh values without stale closures
  const apiDoneRef = useRef(false);
  const apiResultRef = useRef<LawUploadResponse | null>(null);
  const apiErrorRef = useRef<string | null>(null);
  const animCancelRef = useRef(false);

  // Cleanup on unmount
  useEffect(() => () => { animCancelRef.current = true; }, []);

  // ── Core: validate → switch view → call server action → drive animation ───────

  const startAnalysis = useCallback(
    (file: File) => {
      // Validate
      const allowed = [".pdf", ".docx", ".doc"];
      const ext = "." + file.name.split(".").pop()?.toLowerCase();
      if (!allowed.includes(ext)) {
        setUploadError("Solo se admiten archivos .pdf, .docx y .doc.");
        return;
      }
      if (file.size > 25 * 1024 * 1024) {
        setUploadError("El tamaño máximo del archivo es 25 MB.");
        return;
      }

      // Reset all state for a clean run (supports retry)
      setUploadError(null);
      apiDoneRef.current = false;
      apiResultRef.current = null;
      apiErrorRef.current = null;
      animCancelRef.current = false;
      setStepStatuses(STEPS.map(() => "pending"));
      setApiError(null);
      setAllDone(false);

      // Show analyzing view immediately
      setView("analyzing");

      // ── Call the server action ─────────────────────────────────────────────────
      // FormData built on the client, passed directly to the 'use server' action.
      const formData = new FormData();
      formData.append("pdf_files", file);

      uploadLawDocumentAction(formData).then((result) => {
        if (result.success && result.data) {
          apiResultRef.current = result.data;
        } else {
          apiErrorRef.current = result.error ?? "Error inesperado al analizar el documento.";
        }
        apiDoneRef.current = true;
      });

      // ── Animation loop (runs in parallel with the API call) ────────────────────
      (async () => {
        // Steps 1-4: pure cosmetic timers
        for (let i = 0; i < STEPS.length - 1; i++) {
          if (animCancelRef.current) return;

          setStepStatuses((prev) =>
            prev.map((s, idx) => (idx === i ? "in-progress" : s))
          );
          await delay(STEPS[i]?.durationMs || 0);
          if (animCancelRef.current) return;

          setStepStatuses((prev) =>
            prev.map((s, idx) => (idx === i ? "complete" : s))
          );
          await delay(200);
        }

        if (animCancelRef.current) return;

        // Step 5: spin and wait until the server action resolves
        setStepStatuses((prev) =>
          prev.map((s, idx) => (idx === 4 ? "in-progress" : s))
        );

        await waitFor(() => apiDoneRef.current);
        if (animCancelRef.current) return;

        // Server action returned an error
        if (apiErrorRef.current) {
          setApiError(apiErrorRef.current);
          return;
        }

        // Server action succeeded — complete all steps then redirect
        setStepStatuses(STEPS.map(() => "complete"));
        await delay(600);
        if (animCancelRef.current) return;

        const result = apiResultRef.current;
        if (result?.results?.[0]) {
          const doc = result.results[0];
          sessionStorage.setItem(`doc_${doc.document_id}`, JSON.stringify(doc));
          setAllDone(true);
          await delay(900);
          router.push(`/dashboard/documents/${doc.document_id}`);
        } else {
          router.push("/dashboard/documents");
        }
      })();
    },
    [router]
  );

  // ── Event handlers ────────────────────────────────────────────────────────────

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) startAnalysis(file);
    },
    [startAnalysis]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) startAnalysis(file);
    // reset input so the same file can be re-selected after an error
    e.target.value = "";
  };

  const handleRetry = () => {
    setApiError(null);
    setView("upload");
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-3xl mx-auto">
      <AnimatePresence mode="wait">

        {/* ═══════════════════════════════ UPLOAD VIEW ═══════════════════════════ */}
        {view === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
          >
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-[#07172D]">Crear nuevo documento</h1>
              <p className="mt-1 text-sm text-[#4A5565]">
                Sube tu documento de licitación para análisis y revisión de cumplimiento.
              </p>
            </div>

            {/* Drop zone */}
            <label
              htmlFor="file-upload"
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={cn(
                "flex flex-col items-center justify-center gap-4 w-full min-h-56 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200",
                dragging
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-300 bg-white hover:border-blue-300 hover:bg-gray-50"
              )}
            >
              <input
                id="file-upload"
                type="file"
                accept=".pdf,.docx,.doc"
                className="hidden"
                onChange={onInputChange}
              />
              <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-md">
                <Upload className="w-7 h-7 text-white" />
              </div>
              <p className="text-sm font-medium text-[#07172D]">
                Arrastra tu archivo para comenzar la carga
              </p>
              <div className="flex items-center gap-3 w-32">
                <div className="flex-1 h-px bg-gray-300" />
                <span className="text-xs text-gray-400 font-medium">O</span>
                <div className="flex-1 h-px bg-gray-300" />
              </div>
              <span className="px-5 py-2 bg-[#07172D] text-white text-sm font-medium rounded-lg hover:bg-[#0f2a4a] transition-colors">
                Buscar archivos
              </span>
            </label>

            {uploadError && (
              <div className="mt-3 flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Security notice */}
            <div className="mt-5 flex items-start gap-3 px-5 py-4 rounded-xl border border-blue-200 bg-blue-50">
              <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-700">
                  Los documentos se gestionan de forma segura
                </p>
                <p className="text-sm text-blue-600 mt-0.5">
                  Todas las cargas están cifradas y almacenadas en cumplimiento con la normativa de
                  protección de datos. Los documentos solo son accesibles para los usuarios
                  autorizados de tu organización.
                </p>
              </div>
            </div>

            {/* Option cards */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: FileText,
                  title: "Subir documento anterior",
                  desc: "Sube un documento de licitación existente para revisión y mejora",
                },
                {
                  icon: FileText,
                  title: "Subir plantilla oficial",
                  desc: "Comienza con la plantilla aprobada por tu organización",
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
            </div>

            {/* Supported formats */}
            <div className="mt-4 p-5 bg-white rounded-xl border border-gray-200">
              <p className="font-semibold text-[#07172D] text-sm mb-3">
                Formatos admitidos y requisitos
              </p>
              <ul className="space-y-1.5">
                {[
                  "Documentos PDF (.pdf)",
                  "Documentos Microsoft (.docx, .doc)",
                  "Admite documentos largos (25–60 páginas típicamente)",
                  "Tamaño máximo del archivo: 25 MB",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-[#4A5565]">
                    <span className="w-2 h-2 rounded-full bg-gray-300 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        {/* ════════════════════════════ ANALYZING VIEW ═══════════════════════════ */}
        {view === "analyzing" && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
            className="max-w-2xl mx-auto"
          >
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-[#07172D]">Analizando tu documento</h1>
              <p className="mt-1 text-sm text-[#4A5565]">
                Este proceso puede tardar varios minutos según el tamaño del documento.
              </p>
            </div>

            {/* Error banner */}
            <AnimatePresence>
              {apiError && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-6 flex items-start gap-3 px-5 py-4 rounded-xl border border-red-200 bg-red-50"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-700">
                      Error al analizar el documento
                    </p>
                    <p className="text-sm text-red-600 mt-0.5">{apiError}</p>
                    <button
                      onClick={handleRetry}
                      className="mt-2 text-xs font-medium text-red-700 underline"
                    >
                      Volver e intentar de nuevo
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Steps */}
            <div className="flex flex-col gap-3">
              {STEPS.map((step, idx) => {
                const status = stepStatuses[idx];
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.06 }}
                  >
                    <div
                      className={cn(
                        "flex items-center gap-4 p-5 rounded-xl border transition-all duration-500",
                        status === "complete" && "bg-emerald-50 border-emerald-200",
                        status === "in-progress" && "bg-blue-50 border-blue-300",
                        status === "pending" && "bg-white border-gray-200"
                      )}
                    >
                      {/* Icon */}
                      <div className="shrink-0">
                        {status === "complete" ? (
                          <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 18 }}
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
                          className={cn(
                            "text-sm font-semibold",
                            status === "complete" && "text-emerald-700",
                            status === "in-progress" && "text-blue-700",
                            status === "pending" && "text-[#07172D]"
                          )}
                        >
                          {step.title}
                        </p>
                        <p className="text-xs text-[#4A5565] mt-0.5">{step.description}</p>
                      </div>

                      {/* Status badge */}
                      <div className="shrink-0">
                        {status === "complete" && (
                          <span className="text-xs font-semibold text-emerald-600">
                            Completado
                          </span>
                        )}
                        {status === "in-progress" && (
                          <motion.span
                            animate={{ opacity: [1, 0.35, 1] }}
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

            {/* All done */}
            <AnimatePresence>
              {allDone && (
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
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}