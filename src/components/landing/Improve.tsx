"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const stats = [
  { value: "80+", label: "Páginas soportadas por documento" },
  { value: "100%", label: "Aprobación humana requerida" },
  { value: "BOE", label: "Solo fuentes oficiales" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
};

export default function Improve() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{ backgroundColor: "#07162D" }}
      ref={ref}
    >
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Blue ambient glow left */}
      <div className="absolute -left-32 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-600 blur-[120px] opacity-10 pointer-events-none" />
      {/* Blue ambient glow right */}
      <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-500 blur-[120px] opacity-10 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col items-center text-center gap-6"
        >
          {/* Heading */}
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight max-w-3xl"
            style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.02em" }}
          >
            Mejora tu proceso de{" "}
            <span className="relative inline-block">
              preparación de licitación
              <motion.span
                className="absolute -bottom-1 left-0 right-0 h-0.75 rounded-full bg-white/20"
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ delay: 0.7, duration: 0.7, ease: "easeOut" }}
                style={{ transformOrigin: "left" }}
              />
            </span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            className="text-sm sm:text-base max-w-xl leading-relaxed"
            style={{ color: "#797979" }}
          >
            Seguro, cumplidor, y diseñado exclusivamente para administraciones públicas españolas.
            Reduce riesgo legal, ahorra tiempo y presenta licitaciones con confianza.
          </motion.p>

          {/* Stats row */}
          <motion.div
            variants={fadeUp}
            className="grid grid-cols-1 sm:grid-cols-3 gap-px w-full max-w-xl mt-2 rounded-2xl overflow-hidden border border-white/10"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.5, ease: "easeOut" }}
                className="flex flex-col items-center justify-center py-5 px-4 bg-white/5"
              >
                <span
                  className="text-2xl sm:text-3xl font-bold text-white leading-none mb-1"
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  {stat.value}
                </span>
                <span className="text-xs text-center leading-snug" style={{ color: "#797979" }}>
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center gap-3 mt-2"
          >
            <Link href={"/register"}>
            <Button
              size="lg"
              className="bg-white hover:bg-gray-100 text-[#07162D] border-0 px-10 py-3 text-sm font-semibold shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Empezar
            </Button>
            </Link>
            <Link href={"/faq"}>
            <Button
              variant="outline"
              size="lg"
              className="border-white/20 text-white hover:bg-white/10 hover:border-white/30 bg-transparent px-10 py-3 text-sm font-semibold transition-all duration-200"
            >
              Aprender Más
            </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}