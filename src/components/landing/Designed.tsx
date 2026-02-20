"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SuggestionCard } from "../elements/SuggestionCard";

const features = [
  {
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
      >
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    label: "Solo Fuentes Oficiales",
    sub: "Gaceta Oficial del Estado, Portal de Contratación del Gobierno",
  },
  {
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
      >
        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    label: "Sin Caja Negra",
    sub: "Explicación transparente para cada sugerencia de IA",
  },
  {
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
      >
        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    label: "Personal en Control",
    sub: "Cero cambios automáticos. Apruebas todo.",
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

export default function Designed() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{ backgroundColor: "#091A30" }}
    >
      {/* Subtle dot texture */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Soft blue glow top-right */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-600 blur-[120px] opacity-10 pointer-events-none" />
      {/* Soft blue glow bottom-left */}
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-blue-500 blur-[100px] opacity-10 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto" ref={ref}>
        {/* Header */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-14"
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight"
            style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.02em" }}
          >
            Designed For Legal Confidence
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-4 text-sm sm:text-base max-w-xl mx-auto leading-relaxed"
            style={{ color: "#797979" }}
          >
            We prioritize institutional credibility over automation. Every
            suggestion is auditable, transparent, and based on official sources.
          </motion.p>
        </motion.div>

        {/* Two-column: features left, card right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Feature list */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="flex flex-col gap-7"
          >
            {features.map((f, i) => (
              <motion.div
                key={f.label}
                variants={fadeUp}
                className="flex items-start gap-4 group"
              >
                {/* Check + icon */}
                <div
                  className="flex items-center justify-center 
                  w-8 h-8 sm:w-9 sm:h-9 
                  rounded-full bg-white/10 text-white 
                  flex-shrink-0 mt-0.5 
                  group-hover:bg-white/20 
                  transition-colors duration-200"
                >
                  {f.icon}
                </div>

                <div>
                  <p
                    className="
      text-white font-semibold 
      text-sm sm:text-base md:text-lg 
      leading-snug 
      flex items-center gap-2
    "
                  >
                    <svg
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    {f.label}
                  </p>

                  <p
                    className="
        mt-1
        text-xs sm:text-sm md:text-base 
        leading-relaxed
      "
                    style={{ color: "#797979" }}
                  >
                    {f.sub}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Suggestion card */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={
              isInView
                ? { opacity: 1, x: 0, scale: 1 }
                : { opacity: 0, x: 40, scale: 0.96 }
            }
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="flex justify-center lg:justify-end"
          >
            {/* Glow behind card */}
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-blue-500 blur-2xl opacity-20 scale-110 pointer-events-none" />
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <SuggestionCard />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
