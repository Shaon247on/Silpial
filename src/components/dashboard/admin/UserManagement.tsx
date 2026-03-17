"use client";

import { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, Shield, ShieldOff, Users as UsersIcon } from "lucide-react";

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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { User } from "@/types/User.type";
import { toggleBlockUserAction } from "@/actions/admin/user.action";

// ─── Avatar ───────────────────────────────────────────────────────────────────

const AVATAR_PALETTES = [
  { bg: "bg-blue-100",    text: "text-blue-700"    },
  { bg: "bg-violet-100",  text: "text-violet-700"  },
  { bg: "bg-amber-100",   text: "text-amber-700"   },
  { bg: "bg-emerald-100", text: "text-emerald-700" },
  { bg: "bg-rose-100",    text: "text-rose-700"    },
  { bg: "bg-cyan-100",    text: "text-cyan-700"    },
  { bg: "bg-orange-100",  text: "text-orange-700"  },
];

function UserAvatar({ name, seed }: { name: string; seed: number }) {
  const initials =
    name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?";
  const { bg, text } = AVATAR_PALETTES[seed % AVATAR_PALETTES.length];
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${bg} ${text}`}>
      {initials}
    </div>
  );
}

// ─── Summary Strip ────────────────────────────────────────────────────────────

function SummaryStrip({ total, active, blocked }: { total: number; active: number; blocked: number }) {
  const items = [
    { label: "Total",     value: total,   dot: "bg-gray-400",    text: "text-[#07172D]"   },
    { label: "Activo",    value: active,  dot: "bg-emerald-400", text: "text-emerald-700" },
    { label: "Bloqueado", value: blocked, dot: "bg-red-400",     text: "text-red-700"     },
  ];
  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map((item) => (
        <div key={item.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3.5 flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${item.dot}`} />
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">{item.label}</span>
          </div>
          <span className={`text-2xl font-bold leading-none ${item.text}`}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Page number builder ──────────────────────────────────────────────────────

function buildPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "ellipsis")[] = [1];
  if (current > 3) pages.push("ellipsis");

  const start = Math.max(2, current - 1);
  const end   = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("ellipsis");
  pages.push(total);
  return pages;
}

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterStatus = "All" | "Activo" | "Bloqueado";

interface UsersPageProps {
  users: User[];
  totalCount: number;
  activeCount: number;
  blockedCount: number;
  currentPage: number;
  currentSearch: string;
  currentStatus: string;
}

const PER_PAGE = 5;

// ─── Component ────────────────────────────────────────────────────────────────

export default function UsersPage({
  users,
  totalCount,
  activeCount,
  blockedCount,
  currentPage,
  currentSearch,
  currentStatus,
}: UsersPageProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(currentSearch);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>(
    currentStatus === "active"  ? "Activo"    :
    currentStatus === "blocked" ? "Bloqueado" : "All"
  );
  const [page, setPage] = useState(currentPage);

  const [dialog, setDialog] = useState<{
    open: boolean;
    user: User | null;
    action: "Bloquear" | "Desbloquear";
  }>({ open: false, user: null, action: "Bloquear" });

  const [actionError, setActionError]       = useState<string | null>(null);
  const [isActioning, startActionTransition] = useTransition();

  // ── URL sync ─────────────────────────────────────────────────────────────────
  function navigate(nextSearch: string, nextStatus: FilterStatus, nextPage: number) {
    startTransition(() => {
      const params = new URLSearchParams();
      if (nextSearch.trim()) params.set("search", nextSearch.trim());
      if (nextStatus !== "All") params.set("status", nextStatus === "Activo" ? "active" : "blocked");
      if (nextPage > 1)         params.set("page", nextPage.toString());
      router.replace(`?${params.toString()}`, { scroll: false });
    });
  }

  function handleSearch(v: string) { setSearch(v); setPage(1); navigate(v, statusFilter, 1); }
  function handleFilter(v: string) {
    const next = v as FilterStatus;
    setStatusFilter(next); setPage(1); navigate(search, next, 1);
  }
  function handlePage(next: number) { setPage(next); navigate(search, statusFilter, next); }

  // ── Normalise ─────────────────────────────────────────────────────────────────
  const displayUsers = useMemo(() =>
    users.map((user) => {
      const displayName =
        user.full_name?.trim() || user.username || user.email.split("@")[0] || "Usuario sin nombre";
      const isBlocked      = user.status === "blocked" || user.is_banned === true;
      const displayStatus  = isBlocked ? "Bloqueado" : "Activo";
      let   displayLastAccess = "Nunca";
      if (user.last_access) {
        try {
          const date = new Date(user.last_access);
          if (!isNaN(date.getTime())) {
            displayLastAccess = date.toLocaleString("es-ES", {
              day: "2-digit", month: "short", year: "numeric",
              hour: "2-digit", minute: "2-digit",
            });
          }
        } catch { /* ignore */ }
      }
      return { ...user, displayName, displayStatus, displayLastAccess };
    }),
  [users]);

  // ── Pagination ────────────────────────────────────────────────────────────────
  const totalPages  = Math.max(1, Math.ceil(totalCount / PER_PAGE));
  const pageNumbers = buildPageNumbers(page, totalPages);

  // ── Dialog ────────────────────────────────────────────────────────────────────
  const openDialog = (user: User) => {
    setActionError(null);
    const action = user.status === "active" && !user.is_banned ? "Bloquear" : "Desbloquear";
    setDialog({ open: true, user, action });
  };

  const confirmAction = () => {
    if (!dialog.user) return;
    startActionTransition(async () => {
      const result = await toggleBlockUserAction(dialog.user!.id);
      if (result.success) {
        setDialog({ open: false, user: null, action: "Bloquear" });
        setActionError(null);
      } else {
        setActionError(result.error ?? "Error inesperado. Inténtalo de nuevo.");
      }
    });
  };

  return (
    <div className="space-y-5">

      {/* Header */}
      <div>
        <h1 className="text-[22px] font-bold text-[#07172D] leading-tight">Usuarios</h1>
        <p className="text-[13px] text-gray-400 mt-0.5">Gestiona y modera los usuarios de la plataforma</p>
      </div>

      {/* Summary */}
      <SummaryStrip total={totalCount} active={activeCount} blocked={blockedCount} />

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <Input
            placeholder="Buscar por nombre, usuario o correo…"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 h-10 border-gray-200 rounded-xl bg-white focus-visible:ring-[#07172D]/20 focus-visible:border-[#07172D] text-sm placeholder:text-gray-400"
          />
        </div>
        <Select value={statusFilter} onValueChange={handleFilter}>
          <SelectTrigger className="w-full sm:w-40 min-h-10 border-gray-200 rounded-xl text-sm bg-white focus:ring-[#07172D]/20">
            <SelectValue placeholder="Todos los Estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">Todos los Estados</SelectItem>
            <SelectItem value="Activo">Activo</SelectItem>
            <SelectItem value="Bloqueado">Bloqueado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className={`rounded-2xl border border-gray-100 overflow-hidden bg-white shadow-sm transition-opacity duration-150 ${isPending ? "opacity-60 pointer-events-none" : ""}`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                {["Usuario", "Correo", "Estado", "Documentos", "Último Acceso", "Acciones"].map((col, i) => (
                  <th
                    key={col}
                    className={`text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3.5 ${i === 5 ? "text-right" : "text-left"}`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <UsersIcon className="w-5 h-5 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-500">No se encontraron usuarios</p>
                      <p className="text-xs text-gray-400 -mt-2">Intenta ajustar tu búsqueda o filtro</p>
                    </div>
                  </td>
                </tr>
              ) : (
                displayUsers.map((user, i) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors duration-150"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <UserAvatar name={user.displayName} seed={i} />
                        <span className="text-[13px] font-semibold text-[#07172D]">{user.displayName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-500">{user.email}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                        user.displayStatus === "Activo"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "bg-red-50 text-red-600 border border-red-100"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${user.displayStatus === "Activo" ? "bg-emerald-500" : "bg-red-500"}`} />
                        {user.displayStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-baseline gap-1">
                        <span className="text-[13px] font-semibold text-[#07172D]">{user.document_count}</span>
                        <span className="text-[11px] text-gray-400">docs</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[12px] text-gray-400 tabular-nums font-medium">
                      {user.displayLastAccess}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {user.displayStatus === "Activo" ? (
                        <Button size="sm" variant="outline" onClick={() => openDialog(user)}
                          className="h-8 px-3 text-[11px] font-semibold border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 rounded-lg gap-1.5 transition-all">
                          <Shield className="w-3.5 h-3.5" /> Bloquear
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => openDialog(user)}
                          className="h-8 px-3 text-[11px] font-semibold border-emerald-100 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200 rounded-lg gap-1.5 transition-all">
                          <ShieldOff className="w-3.5 h-3.5" /> Desbloquear
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Shadcn Pagination ─────────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <p className="text-[12px] text-gray-400 shrink-0">
            Página <span className="font-semibold text-[#07172D]">{page}</span> de{" "}
            <span className="font-semibold text-[#07172D]">{totalPages}</span>
            {" · "}
            <span className="font-semibold text-[#07172D]">{totalCount}</span> usuarios
          </p>

          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => page > 1 && handlePage(page - 1)}
                  aria-disabled={page === 1}
                  className={page === 1 ? "pointer-events-none opacity-40" : "cursor-pointer"}
                />
              </PaginationItem>

              {pageNumbers.map((p, idx) =>
                p === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={p}>
                    <PaginationLink
                      isActive={p === page}
                      onClick={() => p !== page && handlePage(p as number)}
                      className={p !== page ? "cursor-pointer" : ""}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => page < totalPages && handlePage(page + 1)}
                  aria-disabled={page === totalPages}
                  className={page === totalPages ? "pointer-events-none opacity-40" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* ── Alert Dialog ──────────────────────────────────────────────────────── */}
      <AlertDialog
        open={dialog.open}
        onOpenChange={(open) => !open && setDialog({ open: false, user: null, action: "Bloquear" })}
      >
        <AlertDialogContent className="rounded-2xl max-w-95 p-0 overflow-hidden border-0 shadow-2xl">
          <div className={`h-1.5 w-full ${dialog.action === "Bloquear" ? "bg-red-500" : "bg-emerald-500"}`} />

          <div className="p-6 pt-5">
            <div className="flex justify-center mb-5">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                dialog.action === "Bloquear"
                  ? "bg-red-50 border border-red-100"
                  : "bg-emerald-50 border border-emerald-100"
              }`}>
                {dialog.action === "Bloquear"
                  ? <Shield className="w-6 h-6 text-red-500" />
                  : <ShieldOff className="w-6 h-6 text-emerald-600" />
                }
              </div>
            </div>

            <AlertDialogHeader className="space-y-2 mb-5">
              <AlertDialogTitle className="text-[#07172D] text-[17px] font-bold text-center leading-snug">
                {dialog.action === "Bloquear" ? "¿Bloquear este usuario?" : "¿Restaurar acceso al usuario?"}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-500 text-[13px] leading-relaxed text-center">
                {dialog.action === "Bloquear" ? (
                  <>
                    Estás a punto de bloquear a{" "}
                    <span className="font-semibold text-[#07172D]">
                      {dialog.user?.full_name?.trim() || dialog.user?.username}
                    </span>
                    . Perderá el acceso inmediatamente y no podrá iniciar sesión hasta ser desbloqueado.
                  </>
                ) : (
                  <>
                    Estás a punto de restaurar el acceso para{" "}
                    <span className="font-semibold text-[#07172D]">
                      {dialog.user?.full_name?.trim() || dialog.user?.username}
                    </span>
                    . Recuperará acceso completo de inmediato.
                  </>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>

            {/* Inline error */}
            {actionError && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-100 px-3.5 py-2.5 text-[12px] text-red-600 text-center">
                {actionError}
              </div>
            )}

            <AlertDialogFooter className="flex-col sm:flex-row gap-2 mt-0">
              <AlertDialogCancel
                disabled={isActioning}
                className="flex-1 rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 h-10 text-[13px] font-semibold disabled:opacity-50"
              >
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => { e.preventDefault(); confirmAction(); }}
                disabled={isActioning}
                className={`flex-1 rounded-xl border-0 text-white font-semibold h-10 text-[13px] disabled:opacity-70 ${
                  dialog.action === "Bloquear"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {isActioning ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Procesando…
                  </span>
                ) : (
                  dialog.action === "Bloquear" ? "Sí, Bloquear Usuario" : "Sí, Restaurar Acceso"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}