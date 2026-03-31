"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { principles, steps } from "@/data/HowData";
import Link from "next/link";

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section
        className="relative py-40 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{ backgroundColor: "#09182F" }}
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-blue-500 blur-[120px] opacity-10 pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <Section>
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 text-xs font-medium text-white/50 border border-white/10 rounded-full px-4 py-1.5 bg-white/5 tracking-widest uppercase mb-6"
            >
              Proceso sencillo de 4 pasos
            </motion.span>
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4"
              style={{
                fontFamily: "'Georgia', serif",
                letterSpacing: "-0.02em",
              }}
            >
              Cómo funciona RedactAI
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-base text-white/50 max-w-xl mx-auto leading-relaxed"
            >
              Desde el documento original hasta la licitación lista para su
              presentación, en cuatro pasos transparentes y controlados por
              personas. Sin procesos opacos. Sin cambios automáticos.
            </motion.p>
          </Section>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Step progress indicator */}
          <div className="flex items-center justify-center gap-0 mb-20 overflow-x-auto pb-2">
            {steps.map((step, i) => (
              <div key={step.number} className="flex items-center shrink-0">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-9 h-9 rounded-full border-2 border-[#07162D] flex items-center justify-center bg-[#07162D]">
                    <span className="text-white text-xs font-bold">
                      {step.number}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-[#07162D] uppercase tracking-wide">
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className="w-16 sm:w-24 h-px bg-gray-200 mx-2 shrink-0 -mt-4" />
                )}
              </div>
            ))}
          </div>

          {/* Step cards */}
          <div className="flex flex-col gap-20">
            {steps.map((step, i) => {
              const ref = useRef(null);
              const isInView = useInView(ref, { once: true, margin: "-80px" });
              const isEven = i % 2 === 0;

              return (
                <div
                  key={step.number}
                  ref={ref}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${!isEven ? "lg:flex-row-reverse" : ""}`}
                >
                  {/* Text side */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -32 : 32 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className={!isEven ? "lg:order-2" : ""}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-[#07162D] flex items-center justify-center text-white shrink-0">
                        {step.icon}
                      </div>
                      <span
                        className="text-4xl font-bold"
                        style={{
                          color: "#BDBDBD",
                          fontFamily: "'Georgia', serif",
                        }}
                      >
                        {step.number}
                      </span>
                    </div>
                    <h2
                      className="text-2xl sm:text-3xl font-bold mb-3 leading-snug"
                      style={{
                        color: "#07162D",
                        fontFamily: "'Georgia', serif",
                      }}
                    >
                      {step.title}
                    </h2>
                    <p
                      className="text-sm font-semibold mb-3"
                      style={{ color: "#797979" }}
                    >
                      {step.summary}
                    </p>
                    <p
                      className="text-sm leading-relaxed mb-6"
                      style={{ color: "#424242" }}
                    >
                      {step.description}
                    </p>
                    <ul className="flex flex-col gap-2.5">
                      {step.features.map((f, j) => (
                        <motion.li
                          key={j}
                          initial={{ opacity: 0, x: -10 }}
                          animate={isInView ? { opacity: 1, x: 0 } : {}}
                          transition={{
                            delay: 0.2 + j * 0.08,
                            duration: 0.35,
                            ease: "easeOut",
                          }}
                          className="flex items-start gap-2.5 text-sm"
                          style={{ color: "#424242" }}
                        >
                          <svg
                            className="w-4 h-4 shrink-0 mt-0.5"
                            fill="none"
                            stroke="#07162D"
                            strokeWidth="2.5"
                            viewBox="0 0 24 24"
                          >
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                          {f}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>

                  {/* Visual side */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? 32 : -32 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
                    className={!isEven ? "lg:order-1" : ""}
                  >
                    {step.visual}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section
        className="py-20 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: "#09182F" }}
      >
        <div className="max-w-5xl mx-auto">
          <Section className="text-center mb-12">
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Construido sobre cuatro principios fundamentales
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-sm max-w-xl mx-auto"
              style={{ color: "#797979" }}
            >
              Cada decisión que tomamos al crear RedactAI se basa en estos
              cuatro compromisos.
            </motion.p>
          </Section>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {principles.map((p, i) => {
              const ref = useRef(null);
              const isInView = useInView(ref, { once: true, margin: "-40px" });
              return (
                <motion.div
                  key={p.title}
                  ref={ref}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    delay: i * 0.1,
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 flex gap-4"
                >
                  <span className="text-2xl shrink-0">{p.icon}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1">
                      {p.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "#797979" }}
                    >
                      {p.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white text-center">
        <Section>
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: "#07162D", fontFamily: "'Georgia', serif" }}
          >
            ¿Listo para empezar?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-sm mb-8 max-w-md mx-auto"
            style={{ color: "#797979" }}
          >
            Únase con confianza a las administraciones públicas españolas que ya
            preparan licitaciones que cumplen con la normativa.
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link href={"/register"} className="cursor-pointer">
              <Button
                size="lg"
                className="bg-[#07162D] cursor-pointer hover:bg-[#0d2240] text-white border-0 px-10"
              >
                Comience gratis
              </Button>
            </Link>
            <Link href={"/contact-us"} className="cursor-pointer">
              <Button
                variant="outline"
                size="lg"
                className="cursor-pointer border-[#07162D] text-[#07162D] hover:bg-[#07162D] hover:text-white px-10"
              >
                Contacta con nosotros
              </Button>
            </Link>
          </motion.div>
        </Section>
      </section>
    </div>
  );
}
