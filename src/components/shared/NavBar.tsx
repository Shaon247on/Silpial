"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../elements/Logo";

export type SessionUser = {
  user: {
    id: string;
    email: string;
    full_name: string;
    is_admin: boolean;
    profile_pic: string;
  };
};

export type SessionPayload = {
  user: SessionUser | null;
};

export default function NavBar({ user }: SessionPayload) {
  const pathname = usePathname();

  // Hide navbar if route is not "/"

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navLinks = [
    {
      link: "/",
      title: "Inicio",
    },
    {
      link: "/how-it-works",
      title: "Cómo Funciona",
    },
    {
      link: "/legal-referances",
      title: "Referencia Legal",
    },
    {
      link: "/faq",
      title: "Preguntas Frecuentes",
    },
    {
      link: "/contact-us",
      title: "Contáctanos",
    },
  ];

  if (
    pathname === "/" ||
    pathname === "/how-it-works" ||
    pathname === "/faq" ||
    pathname === "/contact-us" ||
    pathname === "/legal-referances" ||
    pathname === "/legal-references"
  )
  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Logo />

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link, i) => {
                const isActive = pathname === link.link;
                return (
                  <Link key={i} href={link.link}>
                    <motion.span
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                      className={`relative text-sm font-medium transition-colors duration-200 hover:opacity-70 ${
                        scrolled ? "text-[#07162D]" : "text-white/90"
                      } ${isActive ? "font-semibold" : ""}`}
                    >
                      {link.title}
                      {isActive && (
                        <motion.span
                          layoutId="underline"
                          className="absolute left-0 bottom-[-4px] w-full h-0.5 bg-red-600"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        />
                      )}
                    </motion.span>
                  </Link>
                );
              })}
            </nav>

            {/* Desktop CTA Buttons */}
            {user?.user.email? (
              <Link className="hidden md:flex items-center gap-3" href={user?.user.is_admin ? "/admin" : "/dashboard"}>
                <Button variant={"secondary"}>Dashboard</Button>
              </Link>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="hidden md:flex items-center gap-3"
              >
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className={` px-8 text-sm font-medium transition-all duration-300 ${
                      scrolled
                        ? "border-[#07162D] text-[#07162D] hover:bg-[#07162D] hover:text-white"
                        : "border-white text-white hover:bg-white hover:text-[#07162D] bg-transparent"
                    }`}
                  >
                    Inicia sesión
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    variant={scrolled ? "default" : "destructive"}
                  >
                    Empezar
                  </Button>
                </Link>
              </motion.div>
            )}

            {/* Mobile Hamburger */}
            <button
              className={`md:hidden flex flex-col gap-1.5 p-2 rounded-md transition-colors ${
                scrolled ? "text-[#07162D]" : "text-white"
              }`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <motion.span
                animate={
                  mobileOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }
                }
                className={`block w-5 h-0.5 transition-colors duration-300 ${
                  scrolled ? "bg-[#07162D]" : "bg-white"
                }`}
              />
              <motion.span
                animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                className={`block w-5 h-0.5 transition-colors duration-300 ${
                  scrolled ? "bg-[#07162D]" : "bg-white"
                }`}
              />
              <motion.span
                animate={
                  mobileOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }
                }
                className={`block w-5 h-0.5 transition-colors duration-300 ${
                  scrolled ? "bg-[#07162D]" : "bg-white"
                }`}
              />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <motion.div
        initial={false}
        animate={
          mobileOpen
            ? { opacity: 1, pointerEvents: "auto" }
            : { opacity: 0, pointerEvents: "none" }
        }
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-40 bg-[#09182F]/98 backdrop-blur-sm md:hidden"
      >
        <motion.nav
          initial={false}
          animate={mobileOpen ? { y: 0 } : { y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex flex-col items-center justify-center h-full gap-8"
        >
          {navLinks.map((link, i) => {
            const isActive = pathname === link.link;
            return (
              <Link
                href={link.link}
                key={i}
                onClick={() => setMobileOpen(false)}
              >
                <motion.span
                  key={link.link}
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    mobileOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                  }
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className={`relative text-xl font-medium hover:opacity-70 transition-opacity ${
                    isActive ? "text-red-400 font-semibold" : "text-white"
                  }`}
                >
                  {link.title}
                  {isActive && (
                    <motion.span
                      layoutId="mobile-underline"
                      className="absolute left-0 bottom-[-4px] w-full h-0.5 bg-red-400"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                  )}
                </motion.span>
              </Link>
            );
          })}
          {user?.user?.email ? (
            <div className="flex flex-col items-center gap-4 mt-4">
              <Link onClick={()=> setMobileOpen(false)} href={user?.user.is_admin ? "/admin" : "/dashboard"}>
                <Button variant={"secondary"}>Dashboard</Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 mt-4">
              <Link href="/login" onClick={() => setMobileOpen(false)}>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-[#07162D] bg-transparent w-40"
                >
                  Login
                </Button>
              </Link>
              <Link href="/register" onClick={() => setMobileOpen(false)}>
                <Button className="bg-red-600 hover:bg-red-700 text-white border-0 w-40">
                  Empezar
                </Button>
              </Link>
            </div>
          )}
        </motion.nav>
      </motion.div>
    </>
  );
}
