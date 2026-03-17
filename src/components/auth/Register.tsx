"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
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
import { registerAction } from "@/actions/register.action";

// ─── Schema ───────────────────────────────────────────────────────────────────

const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters.")
      .max(50, "Name cannot exceed 50 characters.")
      .regex(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces."),

    email: z
      .string()
      .min(1, "Email is required.")
      .email("Please enter a valid email address."),

    password: z.string().min(8, "Password must be at least 8 characters."),

    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

// ─── Password strength ────────────────────────────────────────────────────────

const requirements = [
  { label: "8+ caracteres", test: (p: string) => p.length >= 8 },
  { label: "Letra mayúscula", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Número", test: (p: string) => /[0-9]/.test(p) },
  { label: "Carácter especial", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;

  const passed = requirements.filter((r) => r.test(password)).length;
  const level = passed <= 1 ? 1 : passed <= 3 ? 2 : 3;
  const barColor = ["", "bg-red-400", "bg-amber-400", "bg-green-500"][level];
  const label = ["", "Débil", "Aceptable", "Fuerte"][level];
  const lblColor = ["", "text-red-500", "text-amber-500", "text-green-600"][level];

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-2 space-y-2"
    >
      <div className="flex items-center gap-1.5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              level >= i ? barColor : "bg-gray-200"
            }`}
          />
        ))}
        <span className={`w-8 text-[10px] font-semibold ${lblColor}`}>{label}</span>
      </div>

      <div className="grid grid-cols-2 gap-1">
        {requirements.map((req) => {
          const ok = req.test(password);
          return (
            <div key={req.label} className="flex items-center gap-1.5">
              <svg
                className={`h-3 w-3 flex-shrink-0 transition-colors ${
                  ok ? "text-green-500" : "text-gray-300"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
              <span
                className={`text-[10px] transition-colors ${
                  ok ? "text-green-600" : "text-gray-400"
                }`}
              >
                {req.label}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const password = form.watch("password");

  function onSubmit(data: RegisterFormValues) {
    setServerError("");

    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("password_confirm", data.confirmPassword);

    startTransition(async () => {
      const result = await registerAction(formData);

      if (!result.success) {
        setServerError(result.error ?? "No se pudo completar el registro.");
      }
    });
  }

  return (
    <div>
      <h1
        className="mb-1 text-2xl font-bold text-[#07162D]"
        style={{ fontFamily: "'Georgia', serif" }}
      >
        Crea tu cuenta
      </h1>

      <p className="mb-8 text-sm text-gray-400">
        Únete a RedactAI y comienza a preparar licitaciones conformes.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-[#07162D]">
                  Nombre
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      {...field}
                      type="text"
                      placeholder="Ingresa nombre"
                      disabled={isPending}
                      className="h-12 rounded-xl border-gray-200 pl-10 text-[#07162D] placeholder:text-gray-400 focus-visible:border-[#07172D] focus-visible:ring-[#07162D]/20"
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-[#07162D]">
                  Correo
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      {...field}
                      type="email"
                      placeholder="Ingresa correo"
                      autoComplete="email"
                      disabled={isPending}
                      className="h-12 rounded-xl border-gray-200 pl-10 text-[#07162D] placeholder:text-gray-400 focus-visible:border-[#07172D] focus-visible:ring-[#07162D]/20"
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-[#07162D]">
                  Contraseña
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Ingresa contraseña"
                      autoComplete="new-password"
                      disabled={isPending}
                      className="h-12 rounded-xl border-gray-200 pl-10 pr-10 text-[#07162D] placeholder:text-gray-400 focus-visible:border-[#07162D] focus-visible:ring-[#07162D]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      disabled={isPending}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-[#07162D]"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <PasswordStrength password={password} />
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-[#07162D]">
                  Confirmar Contraseña
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      {...field}
                      type={showConfirm ? "text" : "password"}
                      placeholder="Reingresa contraseña"
                      autoComplete="new-password"
                      disabled={isPending}
                      className="h-12 rounded-xl border-gray-200 pl-10 pr-10 text-[#07162D] placeholder:text-gray-400 focus-visible:border-[#07162D] focus-visible:ring-[#07162D]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((prev) => !prev)}
                      disabled={isPending}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-[#07162D]"
                    >
                      {showConfirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>

                <AnimatePresence>
                  {field.value && field.value === password && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-1 flex items-center gap-1 text-xs text-green-600"
                    >
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      Las contraseñas coinciden
                    </motion.p>
                  )}
                </AnimatePresence>

                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {serverError ? (
            <p className="text-sm font-medium text-red-500">{serverError}</p>
          ) : null}

          <Button
            type="submit"
            disabled={isPending}
            className="mt-1 h-12 w-full rounded-xl border-0 bg-[#0ea5e9] text-sm font-semibold text-white transition-all duration-200 hover:bg-[#0284c7]"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
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
                Creando cuenta…
              </span>
            ) : (
              "Registrarse"
            )}
          </Button>
        </form>
      </Form>

      <p className="mt-6 text-center text-sm text-gray-500">
        ¿Ya tienes una cuenta?{" "}
        <Link href="/login" className="font-bold text-[#07162D] hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}