"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const contactCards = [
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: "Oficina",
    value: "12/A Greenline Tower, Sector 07, Metro City",
    sub: "Mon–Fri, 9am–6pm CET",
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
        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: "Correo electrónico",
    value: "support@novatechdemo.com",
    sub: "We reply within 24 hours",
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
        <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    label: "Teléfono",
    value: "+1 (555) 234-6789",
    sub: "Available Mon–Fri, 9am–5pm",
  },
];

const topics = [
  "General Inquiry",
  "Technical Support",
  "Sales & Pricing",
  "Legal Compliance",
  "Partnership",
  "Other",
];

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11 } },
};

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    organisation: "",
    topic: "",
    message: "",
  });

  const formRef = useRef(null);
  const isInView = useInView(formRef, { once: true, margin: "-60px" });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1400);
  };

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#07162D] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#07162D]/20 focus:border-[#07162D] transition-colors bg-white";

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
              Nosotras estamos aquí para ayudar
            </span>
            <h1
              className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4"
              style={{
                fontFamily: "'Georgia', serif",
                letterSpacing: "-0.02em",
              }}
            >
              Ponte en contacto
            </h1>
            <p className="text-base text-white/50 leading-relaxed">
              ¿Tienes alguna pregunta sobre RedactAI, necesitas ayuda con el
              cumplimiento normativo o te gustaría explorar una posible
              colaboración? Nos encantaría saber de ti.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact cards */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-0 relative z-10">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {contactCards.map((card) => (
            <motion.div
              key={card.label}
              variants={fadeUp}
              className="bg-white rounded-2xl border border-gray-200 p-5 flex gap-4 shadow-sm hover:shadow-md hover:border-[#07162D]/20 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-[#07162D] flex items-center justify-center text-white flex-shrink-0">
                {card.icon}
              </div>
              <div className="min-w-0">
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-1"
                  style={{ color: "#797979" }}
                >
                  {card.label}
                </p>
                <p className="text-sm font-semibold text-[#07162D] leading-snug break-words">
                  {card.value}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Form + extra info */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Form — 3/5 */}
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, y: 32 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-3"
          >
            <div className="border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              {!submitted ? (
                <>
                  <h2
                    className="text-xl font-bold mb-1"
                    style={{ color: "#07162D", fontFamily: "'Georgia', serif" }}
                  >
                    Envíanos un mensaje
                  </h2>
                  <p className="text-sm text-gray-400 mb-6">
                    Nos pondremos en contacto con usted en el plazo de un día
                    hábil.
                  </p>

                  <div className="flex flex-col gap-4">
                    {/* Name + email row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#07162D] mb-1.5">
                          Nombre completo{" "}
                          <span className="text-red-400">*</span>
                        </label>
                        <input
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="María García"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#07162D] mb-1.5">
                          Dirección de correo electrónico{" "}
                          <span className="text-red-400">*</span>
                        </label>
                        <input
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="maria@ayuntamiento.es"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    {/* Organisation */}
                    <div>
                      <label className="block text-xs font-semibold text-[#07162D] mb-1.5">
                        Organización
                      </label>
                      <input
                        name="organisation"
                        value={form.organisation}
                        onChange={handleChange}
                        placeholder="Ayuntamiento de Madrid"
                        className={inputClass}
                      />
                    </div>

                    {/* Topic */}
                    <div>
                      <label className="block text-xs font-semibold text-[#07162D] mb-1.5">
                        Tema <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="topic"
                          value={form.topic}
                          onChange={handleChange}
                          className={`${inputClass} appearance-none pr-8 cursor-pointer`}
                        >
                          <option value="" disabled>
                            Seleccione un tema...
                          </option>
                          {topics.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                        <svg
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-semibold text-[#07162D] mb-1.5">
                        Mensaje <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Tell us how we can help…"
                        className={`${inputClass} resize-none`}
                      />
                    </div>

                    {/* Submit */}
                    <Button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-full bg-[#07162D] hover:bg-[#0d2240] text-white border-0 py-3 text-sm font-semibold rounded-xl transition-all duration-200"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg
                            className="animate-spin w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8z"
                            />
                          </svg>
                          Envío…
                        </span>
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex flex-col items-center text-center py-10 gap-4"
                >
                  <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
                    <svg
                      className="w-7 h-7 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3
                    className="text-xl font-bold"
                    style={{ color: "#07162D", fontFamily: "'Georgia', serif" }}
                  >
                    Mensaje enviado!
                  </h3>
                  <p className="text-sm text-gray-500 max-w-xs">
                    Gracias por contactarnos. Nuestro equipo le responderá en un
                    plazo de un día hábil.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSubmitted(false);
                      setForm({
                        name: "",
                        email: "",
                        organisation: "",
                        topic: "",
                        message: "",
                      });
                    }}
                    className="border-[#07162D] text-[#07162D] mt-2"
                  >
                    Enviar otro mensaje
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Side info — 2/5 */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            {/* Response times */}
            <div className="rounded-2xl border border-gray-200 p-6">
              <h3 className="text-sm font-bold text-[#07162D] mb-4">
                Tiempos de respuesta típicos
              </h3>
              <div className="flex flex-col gap-3">
                {[
                  {
                    label: "General Inquiry",
                    time: "< 24 hours",
                    color: "bg-green-100 text-green-700",
                  },
                  {
                    label: "Technical Support",
                    time: "< 4 hours",
                    color: "bg-blue-100 text-blue-700",
                  },
                  {
                    label: "Sales & Pricing",
                    time: "Same day",
                    color: "bg-amber-100 text-amber-700",
                  },
                  {
                    label: "Legal Compliance",
                    time: "< 48 hours",
                    color: "bg-purple-100 text-purple-700",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-xs text-gray-500">{item.label}</span>
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${item.color}`}
                    >
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Working hours */}
            <div className="rounded-2xl border border-gray-200 p-6">
              <h3 className="text-sm font-bold text-[#07162D] mb-4">
                Horas de soporte
              </h3>
              <div className="flex flex-col gap-2.5">
                {[
                  { day: "Monday – Friday", hours: "9:00 AM – 6:00 PM CET" },
                  { day: "Saturday", hours: "10:00 AM – 2:00 PM CET" },
                  { day: "Sunday", hours: "Closed" },
                ].map((r) => (
                  <div key={r.day} className="flex justify-between">
                    <span className="text-xs text-gray-500">{r.day}</span>
                    <span className="text-xs font-medium text-[#07162D]">
                      {r.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shortcut CTA */}
            <div
              className="rounded-2xl p-6 flex flex-col gap-3"
              style={{ backgroundColor: "#09182F" }}
            >
              <h3 className="text-sm font-bold text-white">
                ¿Necesita una respuesta urgente?
              </h3>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "#797979" }}
              >
                Consulta nuestras preguntas frecuentes para obtener respuestas
                inmediatas a las preguntas más comunes sobre RedactAI.
              </p>
              <Link href="/faq">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent w-full text-xs"
                >
                  Explorar preguntas frecuentes →
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
