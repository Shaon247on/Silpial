"use client";

import { useState, useRef, useTransition } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import {
  User, Lock, Camera, Eye, EyeOff,
  CheckCircle2, Loader2, X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field, FieldError, FieldGroup, FieldLabel,
} from "@/components/ui/field";

import {
  updateProfileAction,
  updatePasswordAction,
} from "@/actions/profile.action";
import type { UserProfile } from "@/types/profile.type";

// ── Style tokens ───────────────────────────────────────────────────────────────

const inputCls =
  "bg-white border border-gray-200 rounded-xl h-10 px-3 text-sm w-full " +
  "focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all placeholder:text-gray-400";
const readonlyCls =
  "h-10 px-3 text-sm rounded-xl border border-gray-100 bg-gray-50 " +
  "text-gray-400 flex items-center cursor-not-allowed select-none";
const labelCls   = "text-xs font-semibold mb-1.5";
const labelStyle = { color: "#111827" };
const labelGray  = { color: "#9CA3AF" };

// ── Zod schemas ────────────────────────────────────────────────────────────────

const profileSchema = z.object({
  full_name: z.string().min(1, "Full name is required."),
});

const passwordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required."),
    new_password:     z.string().min(6, "Minimum 6 characters."),
    confirm_password: z.string().min(1, "Please confirm your new password."),
  })
  .refine((d) => d.new_password === d.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
  });

type ProfileFormValues  = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

// ── Avatar upload ──────────────────────────────────────────────────────────────

interface AvatarUploadProps {
  currentUrl: string;
  fullName: string;
  onFileChange: (file: File | null) => void;
}

function AvatarUpload({ currentUrl, fullName, onFileChange }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const initials = fullName
    ? fullName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  function handleFile(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB.");
      return;
    }
    setPreview(URL.createObjectURL(file));
    onFileChange(file);
  }

  const src = preview || currentUrl || null;

  return (
    <div className="flex items-center gap-5">
      {/* Avatar */}
      <div className="relative shrink-0">
        <div
          className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center text-xl font-bold"
          style={{ backgroundColor: "#F3F4F6", color: "#374151" }}
        >
          {src ? (
            <Image src={src} alt="Profile picture" fill className="object-cover" />
          ) : (
            <span>{initials}</span>
          )}
        </div>

        {/* Camera overlay */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center shadow-md hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "#111827" }}
          aria-label="Change profile picture"
        >
          <Camera size={13} className="text-white" />
        </button>

        {/* Remove preview */}
        {preview && (
          <button
            type="button"
            onClick={() => { setPreview(null); onFileChange(null); }}
            className="absolute top-0 right-0 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center shadow"
            aria-label="Remove selected photo"
          >
            <X size={10} className="text-white" />
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
      </div>

      <div className="min-w-0">
        <p className="text-[14px] font-semibold truncate" style={{ color: "#111827" }}>
          {fullName || "No name set"}
        </p>
        <p className="text-[12px] text-gray-400 mt-0.5">JPG, PNG or WEBP · max 5 MB</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-1.5 text-[12px] font-semibold underline underline-offset-2 hover:opacity-70 transition-opacity"
          style={{ color: "#111827" }}
        >
          Change photo
        </button>
      </div>
    </div>
  );
}

// ── Section card ───────────────────────────────────────────────────────────────

function Section({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div
        className="flex items-center gap-3 px-6 py-4 border-b border-gray-100"
        style={{ backgroundColor: "#FAFAFA" }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: "#F3F4F6" }}
        >
          <Icon size={17} style={{ color: "#111827" }} />
        </div>
        <div>
          <p className="text-[14px] font-bold" style={{ color: "#111827" }}>{title}</p>
          <p className="text-[12px] text-gray-400">{subtitle}</p>
        </div>
      </div>
      <div className="px-6 py-6">{children}</div>
    </div>
  );
}

// ── Password input with show/hide toggle ──────────────────────────────────────

function PasswordInput({
  id,
  placeholder,
  field,
  fieldState,
  label,
}: {
  id: string;
  placeholder: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fieldState: any;
  label: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={id} className={labelCls} style={labelStyle}>
        {label} <span className="text-red-500">*</span>
      </FieldLabel>
      <div className="relative">
        <Input
          {...field}
          id={id}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          aria-invalid={fieldState.invalid}
          className={`${inputCls} pr-10`}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <Eye size={15} /> : <EyeOff size={15} />}
        </button>
      </div>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

interface ProfileClientProps {
  profile: UserProfile;
}

export default function ProfileClient({ profile }: ProfileClientProps) {

  // ── Personal info ──────────────────────────────────────────────────────────
  const [currentProfile, setCurrentProfile] = useState<UserProfile>(profile);
  const [avatarFile, setAvatarFile]         = useState<File | null>(null);
  const [isProfilePending, startProfileTransition] = useTransition();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { full_name: profile?.full_name },
  });

  const watchedName = profileForm.watch("full_name");

  function handleProfileSubmit(data: ProfileFormValues) {
    startProfileTransition(async () => {
      const fd = new FormData();
      fd.set("full_name", data?.full_name);
      if (avatarFile) fd.set("profile_pic", avatarFile);

      const result = await updateProfileAction(fd);

      if (result.success && result.data) {
        setCurrentProfile(result.data);
        setAvatarFile(null);
        toast.success("Profile updated successfully.", { position: "bottom-right" });
      } else {
        toast.error(result.error ?? "Failed to update profile.", { position: "bottom-right" });
      }
    });
  }

  // ── Security / password ────────────────────────────────────────────────────
  const [isPasswordPending, startPasswordTransition] = useTransition();

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: "",
      new_password:     "",
      confirm_password: "",
    },
  });

  function handlePasswordSubmit(data: PasswordFormValues) {
    startPasswordTransition(async () => {
      const result = await updatePasswordAction(
        data.current_password,
        data.new_password
      );

      if (result.success) {
        passwordForm.reset();
        toast.success("Password updated successfully.", { position: "bottom-right" });
      } else {
        toast.error(result.error ?? "Failed to update password.", { position: "bottom-right" });
        // Surface error on the current_password field if it's a wrong password error
        if (result.error?.toLowerCase().includes("current") ||
            result.error?.toLowerCase().includes("incorrect") ||
            result.error?.toLowerCase().includes("wrong")) {
          passwordForm.setError("current_password", { message: result.error });
        }
      }
    });
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">

      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#111827" }}>Settings</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Manage your profile and account security.
        </p>
      </div>

      {/* ── Personal Information ── */}
      <Section
        icon={User}
        title="Personal Information"
        subtitle="Update your name and profile picture"
      >
        <form
          onSubmit={profileForm.handleSubmit(handleProfileSubmit)}
          className="space-y-6"
        >
          {/* Avatar upload */}
          <AvatarUpload
            currentUrl={currentProfile?.profile_pic}
            fullName={watchedName || currentProfile?.full_name}
            onFileChange={setAvatarFile}
          />

          <FieldGroup>
            {/* Read-only: Email + Username */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className={labelCls} style={labelGray}>Email</p>
                <div className={readonlyCls}>{currentProfile?.email}</div>
              </div>
              <div>
                <p className={labelCls} style={labelGray}>Username</p>
                <div className={readonlyCls}>@{currentProfile?.username}</div>
              </div>
            </div>

            {/* Editable: Full name */}
            <Controller
              name="full_name"
              control={profileForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="full-name" className={labelCls} style={labelStyle}>
                    Full Name <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="full-name"
                    placeholder="Your full name"
                    aria-invalid={fieldState.invalid}
                    className={inputCls}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>

          <Button
            type="submit"
            disabled={isProfilePending}
            className="h-10 px-7 rounded-xl text-sm font-semibold border-0 disabled:opacity-60"
            style={{ backgroundColor: "#111827", color: "white" }}
          >
            {isProfilePending ? (
              <span className="flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" /> Saving…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CheckCircle2 size={14} /> Save Changes
              </span>
            )}
          </Button>
        </form>
      </Section>

      {/* ── Security ── */}
      <Section
        icon={Lock}
        title="Security"
        subtitle="Change your account password"
      >
        <form
          onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
          className="space-y-5"
        >
          <FieldGroup>
            <Controller name="current_password" control={passwordForm.control}
              render={({ field, fieldState }) => (
                <PasswordInput
                  id="current-pw"
                  label="Current Password"
                  placeholder="Enter your current password"
                  field={field}
                  fieldState={fieldState}
                />
              )}
            />
            <Controller name="new_password" control={passwordForm.control}
              render={({ field, fieldState }) => (
                <PasswordInput
                  id="new-pw"
                  label="New Password"
                  placeholder="Min. 6 characters"
                  field={field}
                  fieldState={fieldState}
                />
              )}
            />
            <Controller name="confirm_password" control={passwordForm.control}
              render={({ field, fieldState }) => (
                <PasswordInput
                  id="confirm-pw"
                  label="Confirm New Password"
                  placeholder="Repeat new password"
                  field={field}
                  fieldState={fieldState}
                />
              )}
            />
          </FieldGroup>

          <Button
            type="submit"
            disabled={isPasswordPending}
            className="h-10 px-7 rounded-xl text-sm font-semibold border-0 disabled:opacity-60"
            style={{ backgroundColor: "#111827", color: "white" }}
          >
            {isPasswordPending ? (
              <span className="flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" /> Updating…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Lock size={14} /> Update Password
              </span>
            )}
          </Button>
        </form>
      </Section>
    </div>
  );
}