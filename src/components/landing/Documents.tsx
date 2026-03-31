"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const cards = [
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Datos Sensibles",
    description:
      "Los documentos de contratación pública son extensos, complejos y tienen un importante peso legal.",
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: "Normativa Cambiante",
    description:
      "Mantenerse al día con las últimas modificaciones en la legislación española de contratación es un reto constante.",
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    title: "Riesgo Manual",
    description:
      "Los errores humanos en la redacción manual pueden provocar impugnaciones y retrasos administrativos.",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: "easeOut", delay: i * 0.12 },
  }),
};

export default function Documents() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto" ref={ref}>
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-14"
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight font-poppins"
            style={{
              color: "#07162D",
              fontFamily: "'Georgia', serif",
              letterSpacing: "-0.02em",
            }}
          >
            La preparación de los documentos de{" "}
            <br className="hidden sm:block" />
            licitación es compleja y arriesgada.
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-4 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#797979" }}
          >
            La redacción manual aumenta el riesgo procesal legal y consume un
            tiempo valioso.
          </motion.p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              whileHover={{
                y: -6,
                boxShadow: "0 16px 40px rgba(7,22,45,0.10)",
                transition: { duration: 0.25 },
              }}
              className="rounded-2xl p-6 flex flex-col gap-4 cursor-default"
              style={{ backgroundColor: "#EEEEEE" }}
            >
              {/* Icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#07162D", color: "white" }}
              >
                {card.icon}
              </div>

              {/* Text */}
              <div className="flex flex-col gap-1.5">
                <h3
                  className="text-base font-semibold leading-snug"
                  style={{ color: "#07162D" }}
                >
                  {card.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#797979" }}
                >
                  {card.description}
                </p>
              </div>

              {/* Subtle bottom accent line */}
              <motion.div
                className="h-0.5 rounded-full mt-auto"
                style={{ backgroundColor: "#07162D" }}
                initial={{ scaleX: 0, originX: 0 }}
                animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.4 + i * 0.12,
                  ease: "easeOut",
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
