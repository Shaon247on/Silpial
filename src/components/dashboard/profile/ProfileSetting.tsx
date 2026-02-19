"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

/* =========================
   Schemas
========================= */

const profileSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  profile_pic: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 1024 * 1024,
      "Image size must be less than 1MB",
    )
    .refine(
      (file) => !file || file.type.startsWith("image/"),
      "File must be an image",
    ),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

/* =========================
   Component
========================= */

export default function ProfileSettings() {
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [isPasswordEditing, setIsPasswordEditing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Static Dummy Profile
  const staticProfile = {
    full_name: "John Doe",
    email: "john@example.com",
    profile_pic: "https://github.com/shadcn.png",
  };

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: staticProfile.full_name,
      email: staticProfile.email,
      profile_pic: undefined,
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const displayPreviewUrl = previewUrl || staticProfile.profile_pic;

  /* =========================
     Image Handler
  ========================= */

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      toast.error("Image size must be less than 1MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("File must be an image");
      return;
    }

    profileForm.setValue("profile_pic", file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
      toast.success("Image selected (static preview)");
    };
    reader.readAsDataURL(file);
  };

  /* =========================
     Submit Handlers (Static)
  ========================= */

  const onProfileSubmit = (values: z.infer<typeof profileSchema>) => {
    console.log("Profile Data:", values);
    toast.success("Profile updated (static demo)");
    setIsProfileEditing(false);
  };

  const onPasswordSubmit = (values: z.infer<typeof passwordSchema>) => {
    console.log("Password Data:", values);
    toast.success("Password updated (static demo)");
    passwordForm.reset();
    setIsPasswordEditing(false);
  };

  return (
    <div className="mx-auto p-6 space-y-6 max-w-4xl">
      {/* ================= Profile Section ================= */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-semibold">Profile Information</h2>
            <p className="text-sm text-gray-500">
              Update your personal information and profile picture
            </p>
          </div>

          {!isProfileEditing && (
            <Button
              onClick={() => setIsProfileEditing(true)}
              variant="outline"
              size="sm"
              className="text-black"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>

        <Form {...profileForm}>
          <form
            onSubmit={profileForm.handleSubmit(onProfileSubmit)}
            className="space-y-6"
          >
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="w-40 h-40 rounded-full border-4 border-blue-500 overflow-hidden">
                  <Avatar className="w-full h-full">
                    <AvatarImage
                      src={displayPreviewUrl}
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {staticProfile.full_name[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {isProfileEditing && (
                  <Input
                    type="file"
                    accept="image/*"
                    className="absolute bottom-0 right-0 w-14 h-14 opacity-0 cursor-pointer"
                    onChange={handleImageChange}
                  />
                )}
              </div>

              <span className="text-lg text-blue-500 font-semibold">
                Choose Photo (Max 1MB)
              </span>
            </div>

            {/* Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={profileForm.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly={!isProfileEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={profileForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly={!isProfileEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {isProfileEditing && (
              <div className="flex justify-center gap-3">
                <Button
                  type="button"
                  className="text-black"
                  variant="outline"
                  onClick={() => {
                    profileForm.reset();
                    setPreviewUrl(null);
                    setIsProfileEditing(false);
                  }}
                >
                  Cancel
                </Button>

                <Button type="submit">Save</Button>
              </div>
            )}
          </form>
        </Form>
      </div>

      {/* ================= Password Section ================= */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-semibold">Change Password</h2>
            <p className="text-sm text-gray-500">
              Password must be at least 6 characters
            </p>
          </div>

          {!isPasswordEditing && (
            <Button
              onClick={() => setIsPasswordEditing(true)}
              variant="outline"
              size="sm"
              className="text-black"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>

        <Form {...passwordForm}>
          <form
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            className="space-y-4"
          >
            <div className="space-y-4">
              {["currentPassword", "newPassword", "confirmPassword"].map(
                (fieldName) => (
                  <FormField
                    key={fieldName}
                    control={passwordForm.control}
                    name={fieldName as keyof z.infer<typeof passwordSchema>}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {fieldName === "currentPassword"
                            ? "Current Password"
                            : fieldName === "newPassword"
                              ? "New Password"
                              : "Confirm Password"}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            readOnly={!isPasswordEditing}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ),
              )}
            </div>

            {isPasswordEditing && (
              <div className="flex justify-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="text-black"
                  onClick={() => {
                    passwordForm.reset();
                    setIsPasswordEditing(false);
                  }}
                >
                  Cancel
                </Button>

                <Button type="submit">Update</Button>
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
