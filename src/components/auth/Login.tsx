"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { loginAction } from "@/actions/auth.actions";

// ── Zod Schema ────────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// ── Component ─────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    mode: "onChange",
  });

  const onSubmit = (data: LoginFormValues) => {
  setServerError("");

  const formData = new FormData();
  formData.append("email", data.email);
  formData.append("password", data.password);
  formData.append("rememberMe", String(!!data.rememberMe));

  startTransition(async () => {
    const result = await loginAction(formData);

    if (!result.success) {
      setServerError(result.message);
    }
  });
};

  return (
    <div>
      <h1
        className="mb-1 text-2xl font-bold text-[#07162D]"
        style={{ fontFamily: "'Georgia', serif" }}
      >
        Bienvenido de vuelta
      </h1>

      <p className="mb-8 text-sm text-gray-400">
        Inicia sesión en tu cuenta de RedactAI.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
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
                      className="h-12 rounded-xl border-gray-200 pl-10 text-[#07162D] placeholder:text-gray-400 focus:border-[#07162D] focus:ring-[#07162D]/20"
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-sm font-semibold text-[#07162D]">
                    Contraseña
                  </FormLabel>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-[#0ea5e9] hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <FormControl>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Ingresa contraseña"
                      autoComplete="current-password"
                      disabled={isPending}
                      className="h-12 rounded-xl border-gray-200 pl-10 pr-10 text-[#07162D] placeholder:text-gray-400 focus:border-[#07162D] focus:ring-[#07162D]/20"
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

                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Remember Me */}
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2.5 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isPending}
                    className="border-gray-300 data-[state=checked]:border-[#07162D] data-[state=checked]:bg-[#07162D]"
                  />
                </FormControl>
                <FormLabel className="cursor-pointer text-sm font-normal text-gray-500">
                  Recuérdame por 30 días
                </FormLabel>
              </FormItem>
            )}
          />

          {serverError ? (
            <p className="text-sm font-medium text-red-500">{serverError}</p>
          ) : null}

          <Button
            type="submit"
            disabled={isPending}
            className="h-12 w-full rounded-xl border-0 bg-[#0ea5e9] text-sm font-semibold text-white transition-all duration-200 hover:bg-[#0284c7]"
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
                Iniciando sesión…
              </span>
            ) : (
              "Inicia sesión"
            )}
          </Button>
        </form>
      </Form>

      <p className="mt-6 text-center text-sm text-gray-500">
        ¿No tienes una cuenta?{" "}
        <Link href="/register" className="font-bold text-[#07162D] hover:underline">
          Registrarse
        </Link>
      </p>
    </div>
  );
}