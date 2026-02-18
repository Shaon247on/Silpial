"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AccordionItem from "./AccordianItem";
import { faqData } from "@/data/FAQData";

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState(0);
  const contentRef = useRef(null);

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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-100 h-100 rounded-full bg-blue-500 blur-[100px] opacity-10 pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 text-xs font-medium text-white/50 border border-white/10 rounded-full px-4 py-1.5 bg-white/5 tracking-widest uppercase mb-6">
              {faqData.reduce((acc, c) => acc + c.items.length, 0)} questions
              answered
            </span>
            <h1
              className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4"
              style={{
                fontFamily: "'Georgia', serif",
                letterSpacing: "-0.02em",
              }}
            >
              Frequently Asked Questions
            </h1>
            <p className="text-base text-white/50 leading-relaxed">
              Everything you need to know about RedactAI. Can&apos;t find what
              you&apos;re looking for?{" "}
              <Link
                href="/contact-us"
                className="text-white/80 underline underline-offset-2 hover:text-white transition-colors"
              >
                Contact us.
              </Link>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category tabs + accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Category tab pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {faqData.map((cat, i) => (
            <button
              key={cat.label}
              onClick={() => setActiveCategory(i)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#07162D]"
              style={{
                backgroundColor: activeCategory === i ? "#07162D" : "white",
                borderColor: activeCategory === i ? "#07162D" : "#E5E7EB",
                color: activeCategory === i ? "white" : "#07162D",
              }}
            >
              <span
                style={{
                  color:
                    activeCategory === i ? "rgba(255,255,255,0.7)" : "#9CA3AF",
                }}
              >
                {cat.icon}
              </span>
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* FAQ accordion for active category */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            ref={contentRef}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col gap-3"
          >
            {/* Category heading */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#07162D] flex items-center justify-center text-white shrink-0">
                {faqData[activeCategory].icon}
              </div>
              <h2
                className="text-lg font-bold"
                style={{ color: "#07162D", fontFamily: "'Georgia', serif" }}
              >
                {faqData[activeCategory].label}
              </h2>
              <span className="text-xs text-gray-400 ml-auto">
                {faqData[activeCategory].items.length} questions
              </span>
            </div>

            {faqData[activeCategory].items.map((item, i) => (
              <AccordionItem key={item.q} item={item} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Still need help CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6"
          style={{ backgroundColor: "#09182F" }}
        >
          <div>
            <h3
              className="text-xl font-bold text-white mb-2"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Still have questions?
            </h3>
            <p className="text-sm" style={{ color: "#797979" }}>
              Our team is available Monday–Friday, 9am–6pm CET. We typically
              respond within 24 hours.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link href="/register">
              <Button className="bg-white hover:bg-gray-100 text-[#07162D] border-0 px-6 font-semibold">
                Get Started Free
              </Button>
            </Link>
            <Link href="/contact-us">
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent px-6"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
