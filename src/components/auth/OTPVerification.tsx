"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
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
import { verifyOtpAction } from "@/actions/verify-otp.action";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

const otpSchema = z.object({
  digits: z
    .array(z.string())
    .length(OTP_LENGTH)
    .refine((val) => val.every((d) => /^\d$/.test(d)), {
      message: "Please fill in all 6 digits.",
    }),
});

type OTPFormValues = z.infer<typeof otpSchema>;

export default function OTPVerificationPage() {
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [resending, setResending] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isPending, startTransition] = useTransition();

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

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
    setServerError("");

    const formData = new FormData();
    formData.append("otp", data.digits.join(""));

    startTransition(async () => {
      const result = await verifyOtpAction(formData);

      if (!result.success) {
        setServerError(result.error ?? "No se pudo verificar el código.");
      }
    });
  }

  function handleDigitChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const current = form.getValues("digits");
    const next = [...current];
    next[index] = digit;
    form.setValue("digits", next, { shouldValidate: false, shouldDirty: true });

    if (digit && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    const current = form.getValues("digits");

    if (e.key === "Backspace") {
      if (current[index]) {
        const next = [...current];
        next[index] = "";
        form.setValue("digits", next, { shouldValidate: false, shouldDirty: true });
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pasted) return;

    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((d, i) => {
      next[i] = d;
    });

    form.setValue("digits", next, { shouldValidate: false, shouldDirty: true });
    inputsRef.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  }

  function handleResend() {
    setResending(true);
    setServerError("");
    form.reset({ digits: Array(OTP_LENGTH).fill("") });

    setTimeout(() => {
      setResending(false);
      setCountdown(RESEND_SECONDS);
      inputsRef.current[0]?.focus();
    }, 800);
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="otp"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#07162D] transition-colors mb-8"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>

        <h1
          className="text-2xl font-bold text-[#07162D] mb-1"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Check your email
        </h1>

        <p className="text-sm text-gray-400 mb-1 leading-relaxed">
          We sent a 6-digit verification code. Enter it below to continue.
        </p>

        <p className="text-xs text-[#07162D] font-semibold mb-8">
          Code expires in 5 minutes.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="digits"
              render={() => (
                <FormItem>
                  <div className="flex gap-3 justify-between" onPaste={handlePaste}>
                    {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                      <Controller
                        key={i}
                        control={form.control}
                        name={`digits.${i}` as `digits.${number}`}
                        defaultValue=""
                        render={({ field }) => {
                          const value = field.value ?? "";

                          return (
                            <input
                              ref={(el) => {
                                inputsRef.current[i] = el;
                              }}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={value}
                              disabled={isPending}
                              onChange={(e) => handleDigitChange(i, e.target.value)}
                              onKeyDown={(e) => handleKeyDown(i, e)}
                              className="w-14 h-14 text-center text-xl font-bold rounded-xl border-2 text-[#07162D] bg-white focus:outline-none focus:ring-2 focus:ring-[#07162D]/20 focus:border-[#07162D] transition-all duration-200"
                              style={{
                                borderColor: /^\d$/.test(value) ? "#07162D" : "#E5E7EB",
                                backgroundColor: /^\d$/.test(value)
                                  ? "rgba(7,22,45,0.04)"
                                  : "white",
                              }}
                            />
                          );
                        }}
                      />
                    ))}
                  </div>

                  <div className="flex justify-center gap-1.5 mt-3">
                    {digits.map((d, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full transition-colors duration-200"
                        style={{
                          backgroundColor: /^\d$/.test(d) ? "#07162D" : "#E5E7EB",
                        }}
                      />
                    ))}
                  </div>

                  <FormMessage className="text-xs text-center" />
                </FormItem>
              )}
            />

            {serverError ? (
              <p className="text-sm font-medium text-red-500 text-center">
                {serverError}
              </p>
            ) : null}

            <Button
              type="submit"
              disabled={isPending || !allFilled}
              className="w-full h-12 bg-[#0ea5e9] hover:bg-[#0284c7] text-white border-0 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Verifying…
                </span>
              ) : (
                "Verify Code"
              )}
            </Button>
          </form>
        </Form>

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
              disabled={resending || isPending}
              className="text-sm font-bold text-[#07162D] hover:underline disabled:opacity-50 transition-opacity"
            >
              {resending ? "Sending…" : "Resend OTP"}
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}