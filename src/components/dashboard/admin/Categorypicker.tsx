"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Search, Check, ChevronDown, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { ApiCategory } from "@/types/Document.type";
import { debounce } from "@/lib/debounce";
import { fetchCategoriesPage } from "@/lib/client/categoryClient";

// ── Colour palette ─────────────────────────────────────────────────────────────

const PALETTE = [
  {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-100",
    activeBg: "bg-blue-600",
  },
  {
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-100",
    activeBg: "bg-violet-600",
  },
  {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-100",
    activeBg: "bg-amber-500",
  },
  {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-100",
    activeBg: "bg-emerald-600",
  },
  {
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-100",
    activeBg: "bg-rose-600",
  },
  {
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    border: "border-cyan-100",
    activeBg: "bg-cyan-600",
  },
  {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-100",
    activeBg: "bg-orange-500",
  },
];

export function getCategoryPalette(idx: number) {
  return PALETTE[idx % PALETTE.length];
}

// ─────────────────────────────────────────────────────────────────────────────
// Variant 1: CHIP FILTER BAR
// Used at the top of the document list. Shows "Todos" + scrollable chips.
// Fetches more categories as user scrolls the chip bar.
// ─────────────────────────────────────────────────────────────────────────────

interface ChipFilterBarProps {
  /** Categories already fetched server-side (page 1) */
  initialCategories: ApiCategory[];
  initialHasMore: boolean;
  /** Total doc count (for "Todos" chip) */
  totalCount: number;
  /** Per-category doc counts from server */
  categoryCounts: { id: string; count: number }[];
  /** Currently selected category id, or "" for all */
  selectedId: string;
  onChange: (id: string) => void;
  isLoading?: boolean;
}

export function ChipFilterBar({
  initialCategories,
  initialHasMore,
  totalCount,
  categoryCounts,
  selectedId,
  onChange,
  isLoading,
}: ChipFilterBarProps) {
  const ALL = "__all__";

  const [categories, setCategories] =
    useState<ApiCategory[]>(initialCategories);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [nextPage, setNextPage] = useState(2);
  const [fetching, setFetching] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Sync when server re-renders with fresh initial data
  const prevInitial = useRef(initialCategories);
  if (prevInitial.current !== initialCategories) {
    prevInitial.current = initialCategories;
    setCategories(initialCategories);
    setHasMore(initialHasMore);
    setNextPage(2);
  }

  const loadMore = useCallback(async () => {
    if (fetching || !hasMore) return;
    setFetching(true);
    try {
      const result = await fetchCategoriesPage(nextPage);
      setCategories((prev) => {
        const ids = new Set(prev.map((c) => c.id));
        return [...prev, ...result.categories.filter((c) => !ids.has(c.id))];
      });
      setHasMore(result.hasMore);
      setNextPage(result.nextPage);
    } catch {
      // silently ignore
    } finally {
      setFetching(false);
    }
  }, [fetching, hasMore, nextPage]);

  // IntersectionObserver on a sentinel div at the end of the chip bar
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { root: scrollRef.current, threshold: 0.1 },
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loadMore]);

  const chips = [
    { id: ALL, name: "Todos", count: totalCount },
    ...categories.map((c, i) => ({
      id: c.id,
      name: c.name,
      count: categoryCounts.find((cc) => cc.id === c.id)?.count ?? 0,
      paletteIdx: i,
    })),
  ];

  const active = selectedId || ALL;

  return (
    <div
      ref={scrollRef}
      className={`flex gap-2 overflow-x-auto pb-1 scrollbar-hide transition-opacity duration-150 ${isLoading ? "opacity-60 pointer-events-none" : ""}`}
      style={{ scrollbarWidth: "none" }}
    >
      {chips.map((chip) => {
        const isActive = active === chip.id;
        return (
          <button
            key={chip.id}
            onClick={() => onChange(chip.id === ALL ? "" : chip.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold border whitespace-nowrap shrink-0 transition-all duration-150 ${
              isActive
                ? "bg-[#07172D] text-white border-[#07172D] shadow-sm"
                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            {chip.name}
          </button>
        );
      })}

      {/* Sentinel + spinner at the end */}
      <div ref={sentinelRef} className="shrink-0 flex items-center pl-1">
        {fetching && (
          <Loader2 className="w-3.5 h-3.5 text-gray-400 animate-spin" />
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Variant 2: SELECT DROPDOWN (for forms)
// Looks like a native select but supports infinite scroll + search.
// Exposes a hidden <input name={name} value={value}> for form submission.
// ─────────────────────────────────────────────────────────────────────────────

export interface CategorySelectRef {
  reset: () => void;
}

interface CategorySelectProps {
  /** Form field name */
  name: string;
  /** Initial selected category id */
  defaultValue?: string;
  /** Initial categories from server (page 1) */
  initialCategories: ApiCategory[];
  initialHasMore: boolean;
  placeholder?: string;
  required?: boolean;
  error?: string;
  onChange?: (id: string, name: string) => void;
}

export const CategorySelect = forwardRef<
  CategorySelectRef,
  CategorySelectProps
>(function CategorySelect(
  {
    name,
    defaultValue = "",
    initialCategories,
    initialHasMore,
    placeholder = "Selecciona una categoría",
    required,
    error,
    onChange,
  },
  ref,
) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(defaultValue);
  const [selectedName, setSelectedName] = useState(
    initialCategories.find((c) => c.id === defaultValue)?.name ?? "",
  );

  const [categories, setCategories] =
    useState<ApiCategory[]>(initialCategories);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [nextPage, setNextPage] = useState(2);
  const [fetching, setFetching] = useState(false);
  const [searchFetching, setSearchFetching] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    reset: () => {
      setSelectedId("");
      setSelectedName("");
      setSearch("");
      setCategories(initialCategories);
      setHasMore(initialHasMore);
      setNextPage(2);
    },
  }));

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Load more on scroll sentinel
  const loadMore = useCallback(async () => {
    if (fetching || !hasMore || search) return;
    setFetching(true);
    try {
      const result = await fetchCategoriesPage(nextPage);
      setCategories((prev) => {
        const ids = new Set(prev.map((c) => c.id));
        return [...prev, ...result.categories.filter((c) => !ids.has(c.id))];
      });
      setHasMore(result.hasMore);
      setNextPage(result.nextPage);
    } catch {
      /* ignore */
    } finally {
      setFetching(false);
    }
  }, [fetching, hasMore, nextPage, search]);

  useEffect(() => {
    if (!sentinelRef.current || !open) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { root: listRef.current, threshold: 0.1 },
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loadMore, open]);

  // Debounced search against API
  const debouncedApiSearch = useRef(
    debounce(async (q: string) => {
      setSearchFetching(true);
      try {
        const result = await fetchCategoriesPage(1, q);
        setCategories(result.categories);
        setHasMore(result.hasMore);
        setNextPage(2);
      } catch {
        /* ignore */
      } finally {
        setSearchFetching(false);
      }
    }, 400),
  ).current;

  function handleSearch(q: string) {
    setSearch(q);
    if (q.trim()) {
      debouncedApiSearch(q);
    } else {
      // Reset to initial unfiltered list
      setCategories(initialCategories);
      setHasMore(initialHasMore);
      setNextPage(2);
    }
  }

  function handleSelect(cat: ApiCategory) {
    setSelectedId(cat.id);
    setSelectedName(cat.name);
    setOpen(false);
    setSearch("");
    onChange?.(cat.id, cat.name);
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    setSelectedId("");
    setSelectedName("");
    onChange?.("", "");
  }

  return (
    <div ref={wrapperRef} className="relative">
      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={selectedId} required={required} />

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full h-10 flex items-center justify-between gap-2 px-3 rounded-xl border text-[13px] bg-white transition-all ${
          open
            ? "border-[#07172D] ring-2 ring-[#07172D]/10"
            : error
              ? "border-red-300"
              : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <span
          className={
            selectedName ? "text-[#07172D] font-medium" : "text-gray-400"
          }
        >
          {selectedName || placeholder}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          {selectedId && (
            <span
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 cursor-pointer p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              {searchFetching && (
                <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 animate-spin" />
              )}
              <Input
                autoFocus
                placeholder="Buscar categoría…"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-8 pr-8 h-8 text-[12px] border-gray-200 rounded-lg focus-visible:ring-[#07172D]/20 focus-visible:border-[#07172D]"
              />
            </div>
          </div>

          {/* Options list with scroll + sentinel */}
          <div
            ref={listRef}
            className="max-h-52 overflow-y-auto"
            style={{ scrollbarWidth: "thin" }}
          >
            {categories.length === 0 && !searchFetching ? (
              <p className="text-[12px] text-gray-400 text-center py-6">
                No se encontraron categorías
              </p>
            ) : (
              categories.map((cat, i) => {
                const isSelected = cat.id === selectedId;
                const style = PALETTE[i % PALETTE.length];
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelect(cat)}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left text-[13px] transition-colors hover:bg-gray-50 ${
                      isSelected ? "bg-gray-50" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${style.activeBg}`}
                      />
                      <span
                        className={`truncate font-medium ${isSelected ? "text-[#07172D]" : "text-gray-700"}`}
                      >
                        {cat.name}
                      </span>
                    </div>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-[#07172D] shrink-0" />
                    )}
                  </button>
                );
              })
            )}

            {/* Infinite scroll sentinel */}
            <div ref={sentinelRef} className="flex justify-center py-2">
              {fetching && (
                <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
              )}
              {!hasMore && categories.length > 0 && !search && (
                <span className="text-[11px] text-gray-300">
                  Todas las categorías cargadas
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
    </div>
  );
});
