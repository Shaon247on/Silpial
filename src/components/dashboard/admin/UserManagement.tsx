"use client";

import { useState, useMemo } from "react";
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

import Pagination from "@/components/elements/Pagination";
import { User, UserStatus } from "@/types/Admin.type";
import { DUMMY_USERS } from "@/data/adminData";

type FilterStatus = "All" | UserStatus;

interface DialogState {
  open: boolean;
  user: User | null;
  action: "Ban" | "Unban";
}

const PER_PAGE = 5;

// ─── Avatar ───────────────────────────────────────────────────────────────────

const AVATAR_PALETTES = [
  { bg: "bg-blue-100",   text: "text-blue-700"   },
  { bg: "bg-violet-100", text: "text-violet-700" },
  { bg: "bg-amber-100",  text: "text-amber-700"  },
  { bg: "bg-emerald-100",text: "text-emerald-700"},
  { bg: "bg-rose-100",   text: "text-rose-700"   },
  { bg: "bg-cyan-100",   text: "text-cyan-700"   },
  { bg: "bg-orange-100", text: "text-orange-700" },
];

function UserAvatar({ name, seed }: { name: string; seed: number }) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const { bg, text } = AVATAR_PALETTES[seed % AVATAR_PALETTES.length];
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${bg} ${text}`}>
      {initials}
    </div>
  );
}

// ─── Summary strips ───────────────────────────────────────────────────────────

function SummaryStrip({ total, active, banned }: { total: number; active: number; banned: number }) {
  const items = [
    { label: "Total",   value: total,  dot: "bg-gray-400",    text: "text-[#07172D]"  },
    { label: "Activo",  value: active, dot: "bg-emerald-400", text: "text-emerald-700"},
    { label: "Bloqueado",  value: banned, dot: "bg-red-400",     text: "text-red-700"    },
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(DUMMY_USERS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("All");
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState<DialogState>({ open: false, user: null, action: "Ban" });

  const filtered = useMemo(() => users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All" || u.status === statusFilter;
    return matchSearch && matchStatus;
  }), [users, search, statusFilter]);

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };
  const handleFilter = (v: string) => { setStatusFilter(v as FilterStatus); setPage(1); };
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const activeCount = users.filter((u) => u.status === "Active").length;
  const bannedCount = users.filter((u) => u.status === "Banned").length;

  function openDialog(user: User) {
    setDialog({ open: true, user, action: user.status === "Active" ? "Ban" : "Unban" });
  }

  function confirmAction() {
    if (!dialog.user) return;
    setUsers((prev) => prev.map((u) =>
      u.id === dialog.user!.id
        ? { ...u, status: dialog.action === "Ban" ? "Banned" : "Active" }
        : u
    ));
    setDialog({ open: false, user: null, action: "Ban" });
  }

  return (
    <div className="space-y-5">

      {/* Header */}
      <div>
        <h1 className="text-[22px] font-bold text-[#07172D] leading-tight">Users</h1>
        <p className="text-[13px] text-gray-400 mt-0.5">Manage and moderate platform users</p>
      </div>

      {/* Summary strip */}
      <SummaryStrip total={users.length} active={activeCount} banned={bannedCount} />

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <Input
            placeholder="Buscar por nombre o correo…"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 h-10 border-gray-200 rounded-xl bg-white focus-visible:ring-[#07172D]/20 focus-visible:border-[#07172D] text-sm placeholder:text-gray-400"
          />
        </div>
        <Select value={statusFilter} onValueChange={handleFilter}>
          <SelectTrigger className="w-full sm:w-40 h-10 border-gray-200 rounded-xl text-sm bg-white focus:ring-[#07172D]/20">
            <SelectValue placeholder="Todos los Estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">Todos los Estados</SelectItem>
            <SelectItem value="Active">Activo</SelectItem>
            <SelectItem value="Banned">Bloqueado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-100 overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-175">
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
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <UsersIcon className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">No se encontraron usuarios</p>
                        <p className="text-xs text-gray-400 mt-0.5">Intenta ajustar tu búsqueda o filtro</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((user, i) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors duration-150 group"
                  >
                    {/* User */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <UserAvatar name={user.name} seed={i} />
                        <span className="text-[13px] font-semibold text-[#07172D]">{user.name}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-5 py-3.5 text-[13px] text-gray-500">{user.email}</td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                        user.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "bg-red-50 text-red-600 border border-red-100"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          user.status === "Active" ? "bg-emerald-500" : "bg-red-500"
                        }`} />
                        {user.status}
                      </span>
                    </td>

                    {/* Documents */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-baseline gap-1">
                        <span className="text-[13px] font-semibold text-[#07172D]">{user.documents}</span>
                        <span className="text-[11px] text-gray-400">docs</span>
                      </div>
                    </td>

                    {/* Last login */}
                    <td className="px-5 py-3.5 text-[12px] text-gray-400 tabular-nums font-medium">
                      {user.lastLogin}
                    </td>

                    {/* Action */}
                    <td className="px-5 py-3.5 text-right">
                      {user.status === "Active" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDialog(user)}
                          className="h-8 px-3 text-[11px] font-semibold border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 rounded-lg gap-1.5 transition-all"
                        >
                          <Shield className="w-3.5 h-3.5" />
                          Bloquear
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDialog(user)}
                          className="h-8 px-3 text-[11px] font-semibold border-emerald-100 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200 rounded-lg gap-1.5 transition-all"
                        >
                          <ShieldOff className="w-3.5 h-3.5" />
                          Desbloquear
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

      {/* Pagination */}
      <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />

      {/* Alert dialog */}
      <AlertDialog
        open={dialog.open}
        onOpenChange={(open) => !open && setDialog({ open: false, user: null, action: "Ban" })}
      >
        <AlertDialogContent className="rounded-2xl max-w-95 p-0 overflow-hidden border-0 shadow-2xl">
          {/* Coloured top strip */}
          <div className={`h-1.5 w-full ${dialog.action === "Ban" ? "bg-red-500" : "bg-emerald-500"}`} />

          <div className="p-6 pt-5">
            {/* Icon */}
            <div className="flex justify-center mb-5">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                dialog.action === "Ban" ? "bg-red-50 border border-red-100" : "bg-emerald-50 border border-emerald-100"
              }`}>
                {dialog.action === "Ban"
                  ? <Shield className="w-6 h-6 text-red-500" />
                  : <ShieldOff className="w-6 h-6 text-emerald-600" />
                }
              </div>
            </div>

            <AlertDialogHeader className="space-y-2 mb-5">
              <AlertDialogTitle className="text-[#07172D] text-[17px] font-bold text-center leading-snug">
                {dialog.action === "Ban" ? "¿Bloquear este usuario?" : "¿Restaurar acceso?"}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-500 text-[13px] leading-relaxed text-center">
                {dialog.action === "Ban" ? (
                  <>
                    Estás a punto de bloquear a{" "}
                    <span className="font-semibold text-[#07172D]">{dialog.user?.name}</span>.
                    {" "}Perderán el acceso a la plataforma inmediatamente y no podrán iniciar sesión hasta ser desbloqueados.
                  </>
                ) : (
                  <>
                    Estás a punto de restaurar el acceso para{" "}
                    <span className="font-semibold text-[#07172D]">{dialog.user?.name}</span>.
                    {" "}Recuperarán el acceso completo a la plataforma inmediatamente.
                  </>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="flex-col sm:flex-row gap-2 mt-0">
              <AlertDialogCancel className="flex-1 rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 h-10 text-[13px] font-semibold">
                <span className="text-black">Cancelar</span>
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmAction}
                className={`flex-1 rounded-xl border-0 text-white font-semibold h-10 text-[13px] ${
                  dialog.action === "Ban"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {dialog.action === "Ban" ? "Sí, Bloquear Usuario" : "Sí, Restaurar Acceso"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}