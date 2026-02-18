"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  { label: "8+ characters", test: (p: string) => p.length >= 8 },
  { label: "Uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Number", test: (p: string) => /[0-9]/.test(p) },
  { label: "Special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const passed = requirements.filter((r) => r.test(password)).length;
  const level = passed <= 1 ? 1 : passed <= 3 ? 2 : 3;
  const barColor = ["", "bg-red-400", "bg-amber-400", "bg-green-500"][level];
  const label = ["", "Weak", "Fair", "Strong"][level];
  const lblColor = ["", "text-red-500", "text-amber-500", "text-green-600"][
    level
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-2 space-y-2"
    >
      {/* Bar */}
      <div className="flex items-center gap-1.5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              level >= i ? barColor : "bg-gray-200"
            }`}
          />
        ))}
        <span className={`text-[10px] font-semibold w-8 ${lblColor}`}>
          {label}
        </span>
      </div>
      {/* Checklist */}
      <div className="grid grid-cols-2 gap-1">
        {requirements.map((req) => {
          const ok = req.test(password);
          return (
            <div key={req.label} className="flex items-center gap-1.5">
              <svg
                className={`w-3 h-3 flex-shrink-0 transition-colors ${ok ? "text-green-500" : "text-gray-300"}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
              <span
                className={`text-[10px] transition-colors ${ok ? "text-green-600" : "text-gray-400"}`}
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
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
    mode: "onChange",
  });

  const password = form.watch("password");
  const confirm = form.watch("confirmPassword");

  function onSubmit(data: RegisterFormValues) {
    setIsLoading(true);
    console.log(data);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1500);
  }

  return (
    <div>
      <h1
        className="text-2xl font-bold text-[#07162D] mb-1"
        style={{ fontFamily: "'Georgia', serif" }}
      >
        Create your account
      </h1>
      <p className="text-sm text-gray-400 mb-8">
        Join RedactAI and start preparing compliant tenders.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* ── Email ── */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-[#07162D]">
                  Name
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter name"
                      className="pl-10 h-12 rounded-xl border-gray-200 focus-visible:ring-[#07162D]/20 focus-visible:border-[#07162D] text-[#07162D] placeholder:text-gray-400"
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
                  Email
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter email"
                      className="pl-10 h-12 rounded-xl border-gray-200 focus-visible:ring-[#07162D]/20 focus-visible:border-[#07162D] text-[#07162D] placeholder:text-gray-400"
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* ── Password ── */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-[#07162D]">
                  Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      className="pl-10 pr-10 h-12 rounded-xl border-gray-200 focus-visible:ring-[#07162D]/20 focus-visible:border-[#07162D] text-[#07162D] placeholder:text-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#07162D] transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <PasswordStrength password={password} />
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* ── Confirm Password ── */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-[#07162D]">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <Input
                      {...field}
                      type={showConfirm ? "text" : "password"}
                      placeholder="Re-enter password"
                      className="pl-10 pr-10 h-12 rounded-xl border-gray-200 focus-visible:ring-[#07162D]/20 focus-visible:border-[#07162D] text-[#07162D] placeholder:text-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#07162D] transition-colors"
                    >
                      {showConfirm ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                {/* Match indicator */}
                <AnimatePresence>
                  {field.value && field.value === password && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-green-600 flex items-center gap-1 mt-1"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      Passwords match
                    </motion.p>
                  )}
                </AnimatePresence>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* ── Submit ── */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-[#0ea5e9] hover:bg-[#0284c7] text-white border-0 rounded-xl text-sm font-semibold transition-all duration-200 mt-1"
          >
            {isLoading ? (
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
                Creating account…
              </span>
            ) : (
              "Sign up"
            )}
          </Button>
        </form>
      </Form>

      <p className="text-sm text-center text-gray-500 mt-6">
        Have an account?{" "}
        <Link
          href="/login"
          className="font-bold text-[#07162D] hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
