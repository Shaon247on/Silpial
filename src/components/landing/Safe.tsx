"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Cargar Documentos",
    shortDesc: "Carga de forma segura documentos de licitación existentes o comienza a partir de plantillas oficiales.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
    expandedContent: {
      detail:
        "Nuestro sistema de carga segura acepta formatos Word (.docx) y PDF, soportando archivos grandes de licitación entre 25 y 890 páginas. Los documentos se encriptan en tránsito y en reposo usando encriptación AES-256, totalmente compatible con regulaciones de protección de datos de la UE.",
      bullets: [
        "Arrastra y suelta o explora para cargar",
        "Soporta formatos Word (.docx) y PDF",
        "Maneja archivos grandes de hasta 890 páginas",
        "Encriptación AES-256 de extremo a extremo",
        "O comienza desde cero con plantillas oficiales del gobierno",
      ],
      badge: "Seguro y Rápido",
    },
  },
  {
    number: "02",
    title: "Análisis de IA y Comparación",
    shortDesc: "El sistema analiza la estructura y cláusulas, comparándolas con licitaciones públicas exitosas de administraciones españolas.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    expandedContent: {
      detail:
        "RedactAI compara tu documento con miles de licitaciones públicas españolas aprobadas, identificando brechas de cláusulas, desajustes regulatorios y debilidades estructurales. Cada análisis se basa en la Gaceta Oficial del Estado (BOE) y el Portal de Contratación del Gobierno — sin alucinaciones, sin conjeturas.",
      bullets: [
        "Análisis estructural cláusula por cláusula",
        "Referencia cruzada con la Gaceta Oficial del Estado (BOE)",
        "Comparación con precedentes exitosos de licitación",
        "Marca automáticamente secciones obligatorias faltantes",
        "Detecta lenguaje ambiguo que pueda invitar desafíos legales",
      ],
      badge: "Impulsado por Fuentes Oficiales",
    },
  },
  {
    number: "03",
    title: "Revisa Sugerencias",
    shortDesc: "Comparación lado a lado del texto original y sugerencias de IA — tú decides.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    expandedContent: {
      detail:
        "Mantienes el control total en cada paso. Cada sugerencia de IA se muestra junto al texto original con una explicación en lenguaje sencillo de por qué se recomienda el cambio y qué disposición legal la respalda. Acepta, edita en línea o rechaza — nada se aplica automáticamente.",
      bullets: [
        "Vista lado a lado del texto original vs. sugerido",
        "Explicación en lenguaje sencillo para cada sugerencia",
        "Referencia legal citada para cada recomendación",
        "Acepta, edita o rechaza cada cambio individualmente",
        "Registro completo de auditoría de cada decisión que tomes",
      ],
      badge: "Tú Mantienes el Control",
    },
  },
  {
    number: "04",
    title: "Exportar",
    shortDesc: "Descarga tu documento finalizado y conforme, listo para presentación oficial.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
    expandedContent: {
      detail:
        "Una vez que hayas revisado y aprobado todos los cambios, exporta tu documento en formato Word — preservando todo el formato original, encabezados y numeración de cláusulas. La exportación incluye un informe de resumen de conformidad y un registro de cambios con marca de tiempo que puedes presentar junto a la licitación.",
      bullets: [
        "Exportar como Word (.docx) preservando todo el formato",
        "Informe de resumen de conformidad incluido",
        "Registro de auditoría con marca de tiempo de cambios aceptados",
        "Listo para presentación en portal oficial",
        "Reexporta en cualquier momento si necesitas ediciones adicionales",
      ],
      badge: "Listo para Presentación",
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
            Un Camino Más Seguro y Eficiente
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-4 text-sm sm:text-base max-w-xl mx-auto leading-relaxed"
            style={{ color: "#424242" }}
          >
            Cuatro pasos simples para ir de un documento sin procesar a una licitación confiable legalmente y lista para presentación.
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