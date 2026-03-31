"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { forgotPasswordAction } from "@/actions/forgot-password.action";

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

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onChange",
  });

  function onSubmit(data: ForgotPasswordFormValues) {
    setServerError("");

    const formData = new FormData();
    formData.append("email", data.email);

    startTransition(async () => {
      const result = await forgotPasswordAction(formData);

      if (!result.success) {
        setServerError(result.error ?? "Failed to send code.");
        return;
      }

      setSent(true);
    });
  }

  return (
    <AnimatePresence mode="wait">
      {!sent && (
        <motion.div
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <h1
            className="text-2xl font-bold text-[#07162D] mb-1"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            olvidar contraseña
          </h1>
          <p className="text-sm text-gray-400 mb-8 leading-relaxed">
            Ingresa tu correo registrado y te enviaremos un código de
            verificación para restablecer tu contraseña.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-[#07162D]">
                      Email
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <Input
                          {...field}
                          type="email"
                          placeholder="Enter your registered email"
                          disabled={isPending}
                          className="pl-10 h-12 rounded-xl border-gray-200 focus-visible:ring-[#07162D]/20 focus-visible:border-[#07162D] text-[#07162D] placeholder:text-gray-400"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {serverError ? (
                <p className="text-sm font-medium text-red-500">
                  {serverError}
                </p>
              ) : null}

              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-12 bg-[#0ea5e9] hover:bg-[#0284c7] text-white border-0 rounded-xl text-sm font-semibold transition-all duration-200"
              >
                {isPending ? (
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
                    Enviando código…
                  </span>
                ) : (
                  "Continue"
                )}
              </Button>
            </form>
          </Form>

          <p className="text-sm text-center text-gray-500 mt-6">
            ¿Recuerdas tu contraseña?{" "}
            <Link
              href="/login"
              className="font-bold text-[#07162D] hover:underline"
            >
              Inicia sesión
            </Link>
          </p>
        </motion.div>
      )}

      {sent && (
        <motion.div
          key="sent"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex flex-col items-center text-center gap-4 py-6"
        >
          <div className="w-14 h-14 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center">
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
            className="text-lg font-bold text-[#07162D]"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Code sent!
          </h3>
          <p className="text-sm text-gray-400">
            Redirecting you to verification…
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
