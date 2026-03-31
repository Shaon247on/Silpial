import { motion } from "framer-motion";
export const steps = [
  {
    number: "01",
    label: "Cargar",
    title: "Cargue su Documento de Licitación",
    summary: "Comience con lo que tiene — o desde una plantilla oficial.",
    description:
      "Arrastre y suelte sus documentos de licitación Word (.docx) o PDF existentes en RedactAI. Nuestra plataforma maneja todo, desde especificaciones pequeñas de 25 páginas hasta contratos marco complejos de 890 páginas. También puede elegir entre una biblioteca de plantillas oficiales del gobierno español para comenzar desde cero.",
    features: [
      "Admite formatos Word (.docx) y PDF",
      "Soporta archivos grandes de hasta 890 páginas",
      "Cifrado de extremo a extremo con AES-256",
      "Biblioteca oficial de plantillas gubernamentales",
    ],
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
    visual: (
      <div className="bg-[#f7f8fa] rounded-2xl border border-gray-100 p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-[#07162D]">
            Cargar Documento
          </span>
          <span className="text-[10px] text-gray-400">Máximo 890 páginas</span>
        </div>
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center gap-2 bg-white">
          <div className="w-10 h-10 rounded-full bg-[#07162D]/5 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-[#07162D]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p className="text-xs text-gray-500 text-center">
            Suelte su archivo aquí o{" "}
            <span className="text-[#07162D] font-medium">explore</span>
          </p>
          <p className="text-[10px] text-gray-400">.docx, .pdf soportados</p>
        </div>
        <div className="flex gap-2">
          {["Plantilla A", "Plantilla B", "Plantilla C"].map((t) => (
            <div
              key={t}
              className="flex-1 rounded-lg bg-white border border-gray-200 p-2 text-center"
            >
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
    label: "Análisis",
    title: "La IA Analiza su Documento",
    summary:
      "Análisis profundo cláusula por cláusula basado en fuentes oficiales.",
    description:
      "RedactAI lee cada cláusula y sección de su documento, comparándola contra miles de licitaciones públicas españolas aprobadas y la Gaceta Oficial del Estado (BOE). Identifica brechas, desajustes regulatorios e idiomas que podrían exponer la licitación a desafíos legales, todo en minutos.",
    features: [
      "Análisis estructural cláusula por cláusula",
      "Referencia cruzada con el portal BOE y PLACE",
      "Marca secciones obligatorias faltantes",
      "Detecta lenguaje legalmente ambiguo",
    ],
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    visual: (
      <div className="bg-[#f7f8fa] rounded-2xl border border-gray-100 p-5 flex flex-col gap-3">
        <span className="text-xs font-semibold text-[#07162D]">
          Análisis en progreso…
        </span>
        {[
          { label: "Estructura de cláusula", pct: 100, done: true },
          { label: "Referencia cruzada BOE", pct: 78, done: false },
          { label: "Secciones faltantes", pct: 45, done: false },
        ].map((item) => (
          <div key={item.label}>
            <div className="flex justify-between mb-1">
              <span className="text-[10px] text-gray-500">{item.label}</span>
              <span
                className="text-[10px] font-medium"
                style={{ color: item.done ? "#16a34a" : "#07162D" }}
              >
                {item.pct}%
              </span>
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
          <svg
            className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-[10px] text-blue-600">
            3 problemas detectados — se requiere revisión
          </p>
        </div>
      </div>
    ),
  },
  {
    number: "03",
    label: "Revisión",
    title: "Revise Cada Sugerencia Manualmente",
    summary: "Usted aprueba. Usted rechaza. Nada cambia automáticamente.",
    description:
      "Cada sugerencia de IA se muestra lado a lado con su texto original, junto con una explicación en lenguaje claro y la ley o artículo específico al que hace referencia. Aceptelo tal cual, edítelo en línea o rechácelo completamente. Cada decisión se registra en un registro de auditoría completo.",
    features: [
      "Texto original vs. sugerido lado a lado",
      "Cita legal para cada sugerencia",
      "Aceptar, editar en línea o rechazar",
      "Registro de auditoría completo con marca de tiempo",
    ],
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    visual: (
      <div className="bg-[#f7f8fa] rounded-2xl border border-gray-100 p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#07162D]">
            Sugerencia Detectada
          </span>
          <span className="text-[10px] text-gray-400">2 de 5</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-red-50 border border-red-100 p-2.5">
            <p className="text-[9px] font-semibold text-red-400 uppercase tracking-wide mb-1">
              Original
            </p>
            <p className="text-[10px] text-gray-600 leading-relaxed">
              El contratista deberá entregar las obras dentro de un plazo
              razonable…
            </p>
          </div>
          <div className="rounded-lg bg-green-50 border border-green-100 p-2.5">
            <p className="text-[9px] font-semibold text-green-500 uppercase tracking-wide mb-1">
              Sugerido
            </p>
            <p className="text-[10px] text-gray-600 leading-relaxed">
              El contratista deberá entregar las obras dentro de 90 días
              calendario per Art. 29 Ley 9/2017…
            </p>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
          <p className="text-[9px] text-gray-400 mb-0.5">Referencia legal</p>
          <p className="text-[10px] font-medium text-[#07162D]">
            La cláusula 4.2 requiere per ley 9/2017…
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 rounded-lg bg-[#07162D] text-white text-[10px] font-semibold py-1.5 text-center">
            Aceptar
          </div>
          <div className="flex-1 rounded-lg border border-gray-300 text-gray-500 text-[10px] py-1.5 text-center">
            Editar
          </div>
          <div className="flex-1 rounded-lg border border-gray-300 text-gray-500 text-[10px] py-1.5 text-center">
            Rechazar
          </div>
        </div>
      </div>
    ),
  },
  {
    number: "04",
    label: "Exportar",
    title: "Exporte un Documento Listo para Envío",
    summary:
      "Descargue su licitación finalizada, lista para envío en portal oficial.",
    description:
      "Una vez que haya aprobado todos los cambios, exporte su documento en formato Word. Todo el formato original, numeración de cláusulas y encabezados se conservan. Su descarga incluye un informe de resumen de conformidad y un registro de auditoría con marca de tiempo, ambos pueden enviarse junto con la licitación si es necesario.",
    features: [
      "Exportación Word (.docx) preservando todo el formato",
      "Informe de resumen de conformidad incluido",
      "Registro de auditoría de cambios con marca de tiempo",
      "Reexporte en cualquier momento después de ediciones adicionales",
    ],
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
    visual: (
      <div className="bg-[#f7f8fa] rounded-2xl border border-gray-100 p-5 flex flex-col gap-3">
        <span className="text-xs font-semibold text-[#07162D]">
          Listo para Exportar
        </span>
        <div className="rounded-xl bg-white border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#07162D] truncate">
              Licitación_Final_v2.docx
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Conforme · 142 páginas · 2.4 MB
            </p>
          </div>
          <div className="w-7 h-7 rounded-lg bg-[#07162D] flex items-center justify-center flex-shrink-0">
            <svg
              className="w-3.5 h-3.5 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
        </div>
        {[
          {
            label: "Informe de Conformidad",
            color: "bg-green-50 border-green-100 text-green-700",
          },
          {
            label: "Registro de Auditoría",
            color: "bg-amber-50 border-amber-100 text-amber-700",
          },
        ].map((item) => (
          <div
            key={item.label}
            className={`rounded-lg border px-3 py-2 flex items-center justify-between ${item.color}`}
          >
            <span className="text-[10px] font-medium">{item.label}</span>
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ))}
      </div>
    ),
  },
];

export const principles = [
  {
    icon: "🔒",
    title: "Solo Fuentes Oficiales",
    desc: "BOE, PLACE y Portal de Contratación del Gobierno — nada más.",
  },
  {
    icon: "👁️",
    title: "Sin Caja Negra",
    desc: "Cada sugerencia viene con una explicación transparente y cita legal.",
  },
  {
    icon: "✋",
    title: "Humano en Control",
    desc: "Cero cambios automáticos. Cada edición requiere tu aprobación explícita.",
  },
  {
    icon: "📋",
    title: "Registro de Auditoría Completo",
    desc: "Cada decisión se registra, se marca con hora y es exportable para revisión de conformidad.",
  },
];
