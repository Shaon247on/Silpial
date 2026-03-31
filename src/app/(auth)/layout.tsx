"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/elements/Logo";

// Only /register shows image on the LEFT — all others: image on RIGHT
const IMAGE_LEFT_ROUTES = ["/register", "/forgot-password", "/new-password"];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const imageOnLeft = IMAGE_LEFT_ROUTES.includes(pathname);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">

      {/* ── Form panel ── */}
      <motion.div
        layout
        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        className="relative flex items-center justify-center w-1/2 shrink-0 bg-white z-10"
        style={{ order: imageOnLeft ? 1 : 0 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0, x: imageOnLeft ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: imageOnLeft ? -40 : 40 }}
            transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
            className="w-full max-w-md px-8 py-10"
          >
            {/* Logo */}
            <Logo/>

            {children}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* ── Image panel ── */}
      <motion.div
        layout
        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        className="relative w-1/2 shrink-0 overflow-hidden"
        style={{ order: imageOnLeft ? 0 : 1 }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=1200&q=80')` }}
        />
        <div className="absolute inset-0 bg-[#07162D]/60" />
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname + "-overlay"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
            className="relative z-10 flex flex-col justify-end h-full p-10 pb-14"
          >
            <blockquote
              className="text-white/90 text-lg font-medium leading-relaxed mb-3 max-w-xs"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              &ldquo;Prepare licitaciones que cumplan con las normas con confianza — Cada sugerencia respaldada por fuentes oficiales&ldquo;
            </blockquote>
            <p className="text-white/50 text-sm">RedactAI · Para las administraciones públicas españolas</p>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}