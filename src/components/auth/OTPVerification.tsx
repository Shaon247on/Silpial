"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

// ─── Schema ───────────────────────────────────────────────────────────────────

const OTP_LENGTH     = 5;
const RESEND_SECONDS = 60;

const otpSchema = z.object({
  digits: z
    .array(z.string())
    .length(OTP_LENGTH)
    .refine((val) => val.every((d) => /^\d$/.test(d)), {
      message: "Please fill in all 5 digits.",
    }),
});

type OTPFormValues = z.infer<typeof otpSchema>;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OTPVerificationPage() {
  const router = useRouter();
  const [isLoading,  setIsLoading]  = useState(false);
  const [verified,   setVerified]   = useState(false);
  const [countdown,  setCountdown]  = useState(RESEND_SECONDS);
  const [resending,  setResending]  = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  const form = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { digits: Array(OTP_LENGTH).fill("") },
    mode: "onSubmit",
  });

  const digits = form.watch("digits");
  const allFilled = digits.every((d) => /^\d$/.test(d));

  function onSubmit(data: OTPFormValues) {
    setIsLoading(true);
    console.log("OTP:", data.digits.join(""));
    setTimeout(() => {
      setIsLoading(false);
      setVerified(true);
      setTimeout(() => router.push("/new-password"), 1000);
    }, 1400);
  }

  function handleDigitChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const current = form.getValues("digits");
    const next = [...current];
    next[index] = digit;
    form.setValue("digits", next, { shouldValidate: false });
    if (digit && index < OTP_LENGTH - 1) inputsRef.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    const current = form.getValues("digits");
    if (e.key === "Backspace") {
      if (current[index]) {
        const next = [...current];
        next[index] = "";
        form.setValue("digits", next, { shouldValidate: false });
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
    if (e.key === "ArrowLeft"  && index > 0)            inputsRef.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) inputsRef.current[index + 1]?.focus();
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((d, i) => { next[i] = d; });
    form.setValue("digits", next, { shouldValidate: false });
    inputsRef.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  }

  function handleResend() {
    setResending(true);
    form.reset();
    setTimeout(() => { setResending(false); setCountdown(RESEND_SECONDS); }, 1000);
    setTimeout(() => inputsRef.current[0]?.focus(), 50);
  }

  return (
    <AnimatePresence mode="wait">

      {/* ── OTP form ── */}
      {!verified && (
        <motion.div
          key="otp"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Link
            href="/forgot-password"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#07162D] transition-colors mb-8"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>

          <h1 className="text-2xl font-bold text-[#07162D] mb-1" style={{ fontFamily: "'Georgia', serif" }}>
            Check your email
          </h1>
          <p className="text-sm text-gray-400 mb-1 leading-relaxed">
            We sent a 5-digit verification code. Enter it below to continue.
          </p>
          <p className="text-xs text-[#07162D] font-semibold mb-8">Code expires in 10 minutes.</p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              {/* ── OTP digits field ── */}
              <FormField
                control={form.control}
                name="digits"
                render={() => (
                  <FormItem>
                    {/* Individual digit boxes via Controller */}
                    <div className="flex gap-3 justify-between" onPaste={handlePaste}>
                      {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                        <Controller
                          key={i}
                          control={form.control}
                          name={`digits.${i}` as `digits.${number}`}
                          render={({ field }) => (
                            <input
                              ref={(el) => { inputsRef.current[i] = el; }}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={field.value}
                              onChange={(e) => handleDigitChange(i, e.target.value)}
                              onKeyDown={(e) => handleKeyDown(i, e)}
                              className="w-14 h-14 text-center text-black text-xl font-bold rounded-xl border-2 text-[#07162D] bg-white focus:outline-none focus:ring-2 focus:ring-[#07162D]/20 focus:border-[#07162D] transition-all duration-200"
                              style={{
                                borderColor: /^\d$/.test(field.value) ? "#07162D" : "#E5E7EB",
                                backgroundColor: /^\d$/.test(field.value)
                                  ? "rgba(7,22,45,0.04)"
                                  : "white",
                              }}
                            />
                          )}
                        />
                      ))}
                    </div>

                    {/* Progress dots */}
                    <div className="flex justify-center gap-1.5 mt-3">
                      {digits.map((d, i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full transition-colors duration-200"
                          style={{ backgroundColor: /^\d$/.test(d) ? "#07162D" : "#E5E7EB" }}
                        />
                      ))}
                    </div>

                    <FormMessage className="text-xs text-center" />
                  </FormItem>
                )}
              />

              {/* ── Submit ── */}
              <Button
                type="submit"
                disabled={isLoading || !allFilled}
                className="w-full h-12 bg-[#0ea5e9] hover:bg-[#0284c7] text-white border-0 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Verifying…
                  </span>
                ) : "Verify Code"}
              </Button>
            </form>
          </Form>

          {/* Resend */}
          <div className="flex items-center justify-center gap-1.5 mt-6">
            <p className="text-sm text-gray-500">Didn&apos;t receive the code?</p>
            {countdown > 0 ? (
              <span className="text-sm font-semibold text-gray-400">
                Resend in {countdown}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-sm font-bold text-[#07162D] hover:underline disabled:opacity-50 transition-opacity"
              >
                {resending ? "Sending…" : "Resend OTP"}
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* ── Verified state ── */}
      {verified && (
        <motion.div
          key="done"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex flex-col items-center text-center py-6 gap-4"
        >
          <div className="w-14 h-14 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center">
            <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-[#07162D]" style={{ fontFamily: "'Georgia', serif" }}>Verified!</h3>
          <p className="text-sm text-gray-400">Redirecting to reset your password…</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}