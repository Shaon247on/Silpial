"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

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
        className="relative flex items-center justify-center w-1/2 flex-shrink-0 bg-white z-10"
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
            <div className="flex items-center gap-2 mb-10">
              <div className="w-8 h-8 rounded-lg bg-[#07162D] flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="font-bold text-[#07162D] tracking-tight text-lg">RedactAI</span>
            </div>

            {children}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* ── Image panel ── */}
      <motion.div
        layout
        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        className="relative w-1/2 flex-shrink-0 overflow-hidden"
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
              &ldquo;Prepare compliant tenders with confidence — every suggestion backed by official sources.&ldquo;
            </blockquote>
            <p className="text-white/50 text-sm">RedactAI · For Spanish public administrations</p>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}