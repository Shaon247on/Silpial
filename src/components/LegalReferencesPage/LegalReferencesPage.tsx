"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import type { ApiDocument, ApiCategory } from "@/types/Document.type";
import LawDetail from "@/components/LegalReferencesPage/LawDetail";
import PageHeader from "@/components/elements/PageHeader";
import { LawAlert } from "@/components/elements/LawAlert";
import ReferenceList from "./Referencelist";

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
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  }

  return (
    <div className="min-h-[calc(100vh-200px)]">
      <div className="mb-6">
        <PageHeader
          title="Legal References"
          subtitle="Browse and read official tender laws uploaded for reference."
        />
        <LawAlert
          subtitle="All laws and regulations are officially uploaded by platform administrators and sourced from authenticated legal references."
          title="Verified Regulatory Framework"
        />
      </div>

      <div className="mx-auto max-w-[1400px]">
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
              onPageChange={(page) =>
                updateParams({ page, selected: null })
              }
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