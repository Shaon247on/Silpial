"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import type { ApiDocument, ApiCategory } from "@/types/Document.type";
import LawDetail from "@/components/LegalReferencesPage/LawDetail";
import PageHeader from "@/components/elements/PageHeader";
import { LawAlert } from "@/components/elements/LawAlert";
import ReferenceList from "./Referencelist";
import Link from "next/link";

interface Props {
  documents: ApiDocument[];
  totalCount: number;
  currentPage: number;
  currentSearch: string;
  currentCategory: string;
  selectedDocument: ApiDocument | null;
  initialCategories: ApiCategory[];
  initialCategoriesHasMore: boolean;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export default function LegalReferencesPage({
  documents,
  totalCount,
  currentPage,
  currentSearch,
  currentCategory,
  selectedDocument,
  initialCategories,
  initialCategoriesHasMore,
  hasNextPage,
  hasPreviousPage,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const selectedId = selectedDocument?.id ?? null;

  function updateParams(next: {
    search?: string;
    category?: string;
    selected?: string | null;
    page?: number;
  }) {
    const params = new URLSearchParams(searchParams.toString());

    if (typeof next.search !== "undefined") {
      if (next.search.trim()) params.set("search", next.search.trim());
      else params.delete("search");
    }

    if (typeof next.category !== "undefined") {
      if (next.category) params.set("category", next.category);
      else params.delete("category");
    }

    if (typeof next.selected !== "undefined") {
      if (next.selected) params.set("selected", next.selected);
      else params.delete("selected");
    }

    if (typeof next.page !== "undefined") {
      if (next.page > 1) params.set("page", String(next.page));
      else params.delete("page");
    }

    startTransition(() => {
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    });
  }

  return (
    <div className="min-h-[calc(100vh-200px)]">
      <section
        className="relative py-40 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{ backgroundColor: "#09182F" }}
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-100 h-100 rounded-full bg-blue-500 blur-[100px] opacity-10 pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1
              className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4"
              style={{
                fontFamily: "'Georgia', serif",
                letterSpacing: "-0.02em",
              }}
            >
              Referencias Legales
            </h1>
            <p className="text-base text-white/50 leading-relaxed">
              Browse and read official tender laws uploaded for reference.
              Consulte y lea las leyes oficiales de licitación que se han subido
              para su referencia.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] my-10">
        <div className="flex h-[calc(100vh-300px)] min-h-[600px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <motion.div
            animate={{ width: selectedId ? "42%" : "100%" }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="h-full shrink-0 overflow-hidden border-r border-gray-100 p-6"
            style={{ minWidth: 0 }}
          >
            <ReferenceList
              documents={documents}
              selectedId={selectedId}
              currentSearch={currentSearch}
              currentCategory={currentCategory}
              initialCategories={initialCategories}
              initialCategoriesHasMore={initialCategoriesHasMore}
              isLoading={isPending}
              totalCount={totalCount}
              currentPage={currentPage}
              hasNextPage={hasNextPage}
              hasPreviousPage={hasPreviousPage}
              onSearchChange={(value) =>
                updateParams({ search: value, page: 1, selected: null })
              }
              onCategoryChange={(value) =>
                updateParams({ category: value, page: 1, selected: null })
              }
              onSelect={(id) =>
                updateParams({ selected: selectedId === id ? null : id })
              }
              onPageChange={(page) => updateParams({ page, selected: null })}
            />
          </motion.div>

          <AnimatePresence initial={false}>
            {selectedDocument && (
              <motion.div
                key="detail-panel"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "58%", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="h-full shrink-0 overflow-hidden"
                style={{ minWidth: 0 }}
              >
                <div className="flex h-full flex-col overflow-hidden p-6">
                  <LawDetail
                    document={selectedDocument}
                    onClose={() => updateParams({ selected: null })}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
