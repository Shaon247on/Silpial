"use client";

import { useState } from "react";
import { FileCheck2, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { categories } from "@/data/LawData";
import DropZone from "../../../../DropZone";

const uploadSchema = z.object({
  title: z
    .string()
    .min(3, "El título debe tener al menos 3 caracteres.")
    .max(120, "El título no puede exceder 120 caracteres."),
  category: z.enum(
    [
      "Contratos Públicos",
      "Contratación",
      "Reglamentos",
      "Decretos",
      "Otras Leyes",
    ],
    { required_error: "Por favor selecciona una categoría." },
  ),
  file: z
    .instanceof(File, { message: "Por favor carga un archivo PDF." })
    .refine((f) => f.type === "application/pdf", "Solo se aceptan archivos PDF.")
    .refine(
      (f) => f.size <= 20 * 1024 * 1024,
      "El archivo debe ser menor a 20 MB.",
    ),
});

type UploadFormValues = z.infer<typeof uploadSchema>;

interface UploadDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function UploadDialog({ open, onClose }: UploadDialogProps) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: { title: "", category: undefined, file: undefined },
    mode: "onChange",
  });

  function handleClose() {
    form.reset();
    setSuccess(false);
    setSubmitting(false);
    onClose();
  }

  async function onSubmit(data: UploadFormValues) {
    setSubmitting(true);
    console.log("Publishing:", data);
    // Simulate upload
    await new Promise((r) => setTimeout(r, 1800));
    setSubmitting(false);
    setSuccess(true);
    setTimeout(handleClose, 1400);
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-[480px] rounded-2xl p-0 border-0 shadow-2xl overflow-hidden gap-0">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <DialogHeader>
            <DialogTitle className="text-[18px] font-bold text-[#07172D] leading-snug">
              Cargar Nueva Ley
            </DialogTitle>
            <DialogDescription className="text-[13px] text-gray-400 mt-0.5 leading-relaxed">
              Añade una nueva referencia legal que será visible para todos los usuarios.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {success ? (
            /* ── Success state ── */
            <div className="flex flex-col items-center text-center gap-3 py-8">
              <div className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
                <FileCheck2 className="w-7 h-7 text-emerald-500" />
              </div>
              <div>
                <p className="text-[15px] font-bold text-[#07172D]">
                  ¡Publicado correctamente!
                </p>
                <p className="text-[12px] text-gray-400 mt-1">
                  La ley ahora es visible para todos los usuarios.
                </p>
              </div>
            </div>
          ) : (
            /* ── Form ── */
            <Form {...form}>
              <form
                id="upload-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <div className="flex items-center justify-between gap-5">
                  {/* Law Title */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-[13px] font-semibold text-[#07172D]">
                          Título de la Ley
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="p. ej. Ley 9/2017 sobre Contratos del Sector Público"
                            className="h-11 rounded-xl border-gray-200 bg-white text-[13px] text-[#07172D] placeholder:text-gray-400 focus-visible:ring-[#07172D]/20 focus-visible:border-[#07172D]"
                          />
                        </FormControl>
                        <FormMessage className="text-[11px]" />
                      </FormItem>
                    )}
                  />

                  {/* Category */}
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-[13px] font-semibold text-[#07172D]">
                          Categoría
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="min-h-11 w-full  rounded-xl border-gray-200 bg-white text-[13px] focus:ring-[#07172D]/20 focus:border-[#07172D] data-[placeholder]:text-gray-400">
                              <SelectValue placeholder="Selecciona una categoría…" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((c) => (
                              <SelectItem
                                key={c}
                                value={c}
                                className="text-[13px]"
                              >
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-[11px]" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* File upload */}
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-[13px] font-semibold text-[#07172D]">
                        Cargar PDF
                      </FormLabel>
                      <FormControl>
                        <DropZone
                          value={field.value ?? null}
                          onChange={field.onChange}
                          error={fieldState.error?.message}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          )}
        </div>

        {/* Footer */}
        {!success && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/60 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={submitting}
              className="h-10 px-5 rounded-xl border-gray-200 text-gray-600 text-[13px] font-semibold hover:bg-gray-100"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              form="upload-form"
              disabled={submitting}
              className="h-10 px-6 rounded-xl bg-[#07172D] hover:bg-[#0d2240] text-white border-0 text-[13px] font-semibold gap-2 min-w-[100px] transition-all"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Publicando…
                </>
              ) : (
                "Publicar"
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
