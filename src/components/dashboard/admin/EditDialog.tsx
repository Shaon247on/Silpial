"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
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
import { LegalReference } from "@/types/law.type";

const editSchema = z.object({
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
});

type EditFormValues = z.infer<typeof editSchema>;

interface EditDialogProps {
  open: boolean;
  onClose: () => void;
  reference: LegalReference;
  onUpdate: (updatedRef: LegalReference) => void;
}

export default function EditDialog({
  open,
  onClose,
  reference,
  onUpdate,
}: EditDialogProps) {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: { title: reference.title, category: reference.category },
    mode: "onChange",
  });

  function handleClose() {
    form.reset();
    setSubmitting(false);
    onClose();
  }

  async function onSubmit(data: EditFormValues) {
    setSubmitting(true);
    // Simulate update; use server action in production
    await new Promise((r) => setTimeout(r, 1000));
    const updated = { ...reference, ...data };
    onUpdate(updated);
    setSubmitting(false);
    handleClose();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-[480px] rounded-2xl p-0 border-0 shadow-2xl overflow-hidden gap-0">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <DialogHeader>
            <DialogTitle className="text-[18px] font-bold text-[#07172D] leading-snug">
              Editar Ley
            </DialogTitle>
            <DialogDescription className="text-[13px] text-gray-400 mt-0.5 leading-relaxed">
              Actualiza el título y la categoría de la referencia legal.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <Form {...form}>
            <form
              id="edit-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
            >
              {/* Law Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
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
                  <FormItem>
                    <FormLabel className="text-[13px] font-semibold text-[#07172D]">
                      Categoría
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="min-h-11 rounded-xl border-gray-200 bg-white text-[13px] focus:ring-[#07172D]/20 focus:border-[#07172D] data-[placeholder]:text-gray-400">
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
            </form>
          </Form>
        </div>

        {/* Footer */}
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
            form="edit-form"
            disabled={submitting}
            className="h-10 px-6 rounded-xl bg-[#07172D] hover:bg-[#0d2240] text-white border-0 text-[13px] font-semibold gap-2 min-w-[100px] transition-all"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Actualizando…
              </>
            ) : (
              "Actualizar"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}