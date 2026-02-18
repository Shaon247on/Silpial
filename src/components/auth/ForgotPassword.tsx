"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// ─── Schema ───────────────────────────────────────────────────────────────────

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ForgotPasswordPage() {
  const router   = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [sent,      setSent]      = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onChange",
  });

  function onSubmit(data: ForgotPasswordFormValues) {
    setIsLoading(true);
    console.log(data);
    setTimeout(() => {
      setIsLoading(false);
      setSent(true);
      setTimeout(() => router.push("/otp-verification"), 1200);
    }, 1500);
  }

  return (
    <AnimatePresence mode="wait">

      {/* ── Form state ── */}
      {!sent && (
        <motion.div
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#07162D] transition-colors mb-8"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" />
            </svg>
            Back to login
          </Link>

          <h1 className="text-2xl font-bold text-[#07162D] mb-1" style={{ fontFamily: "'Georgia', serif" }}>
            Forgot password?
          </h1>
          <p className="text-sm text-gray-400 mb-8 leading-relaxed">
            Enter your registered email and &apos;ll send you a verification code to reset your password.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

              {/* ── Email ── */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-[#07162D]">Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <Input
                          {...field}
                          type="email"
                          placeholder="Enter your registered email"
                          className="pl-10 h-12 rounded-xl border-gray-200 focus-visible:ring-[#07162D]/20 focus-visible:border-[#07162D] text-[#07162D] placeholder:text-gray-400"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* ── Submit ── */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#0ea5e9] hover:bg-[#0284c7] text-white border-0 rounded-xl text-sm font-semibold transition-all duration-200"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Sending code…
                  </span>
                ) : "Continue"}
              </Button>
            </form>
          </Form>

          <p className="text-sm text-center text-gray-500 mt-6">
            Remember your password?{" "}
            <Link href="/login" className="font-bold text-[#07162D] hover:underline">Sign in</Link>
          </p>
        </motion.div>
      )}

      {/* ── Sent state ── */}
      {sent && (
        <motion.div
          key="sent"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex flex-col items-center text-center gap-4 py-6"
        >
          <div className="w-14 h-14 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center">
            <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-[#07162D]" style={{ fontFamily: "'Georgia', serif" }}>
            Code sent!
          </h3>
          <p className="text-sm text-gray-400">Redirecting you to verification…</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}