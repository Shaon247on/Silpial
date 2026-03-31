"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Logo from "../elements/Logo";

// Floating particle dots for background ambiance
const particles = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 6 + 6,
  delay: Math.random() * 4,
}));

const recentDocs = [
  { name: "Public Infrastructure Maintence Contract 2025", sections: 42 },
  { name: "IT Services Framework Agreement", sections: 38 },
  { name: "Municipal Waste Management Tender", sections: 35 },
  { name: "Urban Planning Consultation Services", sections: 38 },
  { name: "IT Services Framework Agreement", sections: 35 },
];

function DashboardMockup() {
  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-white/10">
      {/* Top navbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gray-200" />
          <div
            className="flex items-center gap-1 text-gray-500"
            style={{ fontSize: 9 }}
          >
            <svg
              className="w-2.5 h-2.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex bg-white" style={{ minHeight: 280 }}>
        {/* Sidebar */}
        <div className="w-28 bg-[#07162D] flex flex-col py-3 px-2 gap-1 shrink-0">
          <div className="flex items-center gap-1.5 bg-white/10 rounded-md px-2 py-1.5 mb-1">
            <svg
              className="w-2.5 h-2.5 text-white shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="text-white font-medium" style={{ fontSize: 9 }}>
              Home
            </span>
          </div>
          {["History", "Legal References"].map((item) => (
            <div
              key={item}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-md"
            >
              <svg
                className="w-2.5 h-2.5 text-white/50 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-white/50" style={{ fontSize: 9 }}>
                {item}
              </span>
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 flex flex-col gap-3 bg-[#f7f8fa]">
          {/* Welcome header */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <p
                className="font-bold text-[#07162D] leading-tight"
                style={{ fontSize: 13 }}
              >
                ¡Bienvenido de vuelta, Silpia!
              </p>
              <p className="text-gray-400 mt-0.5" style={{ fontSize: 9 }}>
                Administra tus documentos de licitación con claridad y
                cumplimiento normativo.
              </p>
            </div>
            <div
              className="flex items-center gap-1 bg-[#07162D] text-white font-medium px-2.5 py-1.5 rounded-lg shrink-0"
              style={{ fontSize: 9 }}
            >
              <svg
                className="w-2.5 h-2.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden md:block">Crear nuevo documento</span>
            </div>
          </div>

          {/* Table card */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <p
              className="text-[#07162D] font-semibold px-3 py-2 border-b border-gray-100"
              style={{ fontSize: 10 }}
            >
              Recent document
            </p>

            {/* Table header */}
            <div
              className="grid px-3 py-1.5 bg-gray-50 border-b border-gray-100"
              style={{ gridTemplateColumns: "1fr 52px 80px 44px" }}
            >
              {["DOCUMENT", "SECTIONS", "LAST MODIFIED", "ACTIONS"].map((h) => (
                <span
                  key={h}
                  className="text-gray-400 font-semibold tracking-wide"
                  style={{ fontSize: 8 }}
                >
                  {h}
                </span>
              ))}
            </div>

            {/* Rows */}
            {recentDocs.map((doc, i) => (
              <div
                key={i}
                className="grid px-3 py-2 border-b border-gray-50 items-center"
                style={{ gridTemplateColumns: "1fr 52px 80px 44px" }}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <svg
                    className="w-2.5 h-2.5 text-gray-400 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span
                    className="text-[#07162D] truncate"
                    style={{ fontSize: 9 }}
                  >
                    {doc.name}
                  </span>
                </div>
                <span className="text-gray-500" style={{ fontSize: 9 }}>
                  {doc.sections}
                </span>
                <span className="text-gray-400" style={{ fontSize: 9 }}>
                  Today at 12:45
                </span>
                <span
                  className="text-blue-500 font-medium"
                  style={{ fontSize: 9 }}
                >
                  View
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, ease: "easeOut" } },
};

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#09182F" }}
    >
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* ── Blue glowing orb system ── */}

      {/* Layer 1: Outermost atmospheric wash — huge, very blurry, lights up entire bg */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{ top: "0%", left: "50%", translateX: "-50%" }}
        animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.15, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-150 h-150 rounded-full bg-blue-500 blur-[120px] opacity-30" />
      </motion.div>

      {/* Layer 2: Mid glow — tighter, brighter */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{ top: "6%", left: "50%", translateX: "-50%" }}
        animate={{ opacity: [0.4, 0.85, 0.4], scale: [1, 1.1, 1] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.3,
        }}
      >
        <div className="w-[320px] h-80 rounded-full bg-blue-400 blur-[80px] opacity-50" />
      </motion.div>

      {/* Layer 3: Core orb — visible ball shape with soft blur edges */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{ top: "10%", left: "50%", translateX: "-50%" }}
        animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.06, 1] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.6,
        }}
      >
        <div className="w-45 h-45 rounded-full bg-blue-300 blur-2xl opacity-70" />
      </motion.div>

      {/* Layer 4: Bright inner nucleus */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{ top: "13%", left: "50%", translateX: "-50%" }}
        animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.08, 1] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.9,
        }}
      >
        <div className="w-20 h-20 rounded-full bg-sky-200 blur-lg opacity-90" />
      </motion.div>

      {/* Floating particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/20 pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -18, 0],
            opacity: [0.15, 0.5, 0.15],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 flex flex-col items-center text-center gap-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-5"
        >
          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight max-w-3xl"
            style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.02em" }}
          >
            Prepare licitaciones que cumplan con las{" "}
            <span className="relative inline-block">
              <span className="relative z-10">normas con confianza</span>
              <motion.span
                className="absolute bottom-1 left-0 right-0 h-2 bg-red-600/30 rounded-sm z-0"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
                style={{ transformOrigin: "left" }}
              />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            className="text-base sm:text-lg text-white/55 max-w-xl leading-relaxed"
          >
            Redacción y revisión de procesos de contratación asistida por IA
            para administraciones españolas, con control humano completo.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center gap-3 mt-2"
          >
            <Link href={"/register"}>
              <Button
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white border-0 px-8 py-3 text-sm font-semibold shadow-lg shadow-red-900/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                Empezar
              </Button>
            </Link>
            <Link href={"/how-it-works"}>
              <Button className="text-white" variant="outline" size="lg">
                Cómo Funciona
              </Button>
            </Link>
          </motion.div>

          {/* Trust line */}
          <motion.p
            variants={fadeUp}
            className="text-xs text-white/30 mt-1 tracking-wide"
          >
            Con la confianza de las administraciones públicas españolas · Sin
            cambios automáticos ·
          </motion.p>
        </motion.div>

        {/* Dashboard mockup */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
          className="w-full mt-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.65, duration: 0.7, ease: "easeOut" }}
            whileHover={{ y: -4, transition: { duration: 0.3 } }}
          >
            {/* Glow behind mockup */}
            <div
              className="absolute left-1/2 -translate-x-1/2 w-2/3 h-20 blur-3xl opacity-10 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse, #dc2626 0%, transparent 70%)",
                bottom: "8%",
              }}
            />
            <DashboardMockup />
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade into white */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, white)",
        }}
      />
    </section>
  );
}
