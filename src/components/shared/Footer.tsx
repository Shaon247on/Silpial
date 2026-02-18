"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const footerLinks = {
  Company: [
    "About Us",
    "How it Works",
    "Legal References",
    "Privacy Policy",
    "Terms of Service",
  ],
  Product: ["Features", "Security", "Compliance", "Pricing", "Changelog"],
  Support: ["Documentation", "Contact Us", "FAQ", "Status"],
};

const socialIcons = {
  Twitter: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.732-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  ),
  Instagram: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  ),
  Facebook: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// Animated dot canvas
function DotBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const DOT_SPACING = 28;
    const DOT_RADIUS_BASE = 1.5;
    const DOT_COLOR = "180, 180, 180";

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const cols = Math.ceil(w / DOT_SPACING) + 1;
      const rows = Math.ceil(h / DOT_SPACING) + 1;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * DOT_SPACING;
          const y = row * DOT_SPACING;

          // Each dot pulses at its own phase based on position
          const phase = col * 0.4 + row * 0.4 + time * 0.6;
          const pulse = (Math.sin(phase) + 1) / 2; // 0 → 1
          const radius = DOT_RADIUS_BASE * (0.5 + pulse * 0.9);
          const opacity = 0.2 + pulse * 0.5;

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${DOT_COLOR}, ${opacity})`;
          ctx.fill();
        }
      }

      time += 0.018;
      animationId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 1 }}
    />
  );
}

export default function Footer() {
  const pathname = usePathname();

  if (
    pathname === "/" ||
    pathname === "/how-it-works" ||
    pathname === "/faq" ||
    pathname === "/contact-us" ||
    pathname === "/legal-referances" ||
    pathname === "/legal-references"
  )
    return (
      <footer className="relative bg-white overflow-hidden pt-20 pb-8 px-4 sm:px-6">
        {/* Animated dot grid background */}
        <DotBackground />

        <div className="relative z-10 max-w-360 mx-auto">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {/* Top row: brand + links */}
            <div className="flex justify-between gap-10 mb-16">
              {/* Brand column */}
              <motion.div variants={fadeUp} className="lg:col-span-2">
                {/* Logo */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#07162D] flex items-center justify-center">
                    <span className="text-white text-sm font-bold tracking-tight">
                      R
                    </span>
                  </div>
                  <span className="font-bold text-lg text-[#07162D] tracking-tight">
                    RedactAI
                  </span>
                </div>

                <p className="text-sm leading-relaxed text-gray-500 max-w-xs mb-6">
                  NovaTech Solutions Ltd. is a forward-thinking software company
                  dedicated to building intuitive, efficient, and scalable
                  digital products for businesses of all sizes. We specialize in
                  developing modern web applications, cloud-based tools
                </p>

                {/* Contact info */}
              </motion.div>
              <motion.div className="col-span-3" variants={fadeUp}>
                <div className="flex flex-col gap-2.5">
                  <h1 className="text-3xl font-semibold">Contact Info</h1>
                  <p className="text-sm max-w-xl text-gray-400">
                    NovaTech Solutions Ltd. is a forward-thinking software
                    company dedicated to building
                    intuitive.dsfafdasdfsadasdfasdf
                  </p>
                  <div className="flex items-center gap-2.5 text-sm text-gray-500">
                    <svg
                      className="w-4 h-4 text-[#07162D] shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    12/A Greenline Tower, Sector 07, Metro City
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-gray-500">
                    <svg
                      className="w-4 h-4 text-[#07162D] shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    support@novatechdemo.com
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-gray-500">
                    <svg
                      className="w-4 h-4 text-[#07162D] shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    +1 (555) 234-6789
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Divider */}
            <motion.div
              variants={fadeUp}
              className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              {/* Copyright */}
              <p className="text-xs text-gray-400 text-center sm:text-left">
                © {new Date().getFullYear()} NovaTech Solutions Ltd. All rights
                reserved.
              </p>

              {/* Social icons */}
              <div className="flex items-center gap-3">
                {Object.entries(socialIcons).map(([name, icon]) => (
                  <motion.a
                    key={name}
                    href="#"
                    aria-label={name}
                    whileHover={{ y: -3, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#07162D] hover:border-[#07162D] transition-colors duration-200"
                  >
                    {icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </footer>
    );
}
