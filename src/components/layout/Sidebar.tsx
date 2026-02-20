"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Activity, BookOpen, X, DockIcon, User, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { label: "Inicio", href: "/dashboard", icon: Home },
  { label: "Documentos", href: "/dashboard/documents", icon: DockIcon },
  { label: "Referencias Legales", href: "/dashboard/legal", icon: BookOpen },
];
const adminNav: NavItem[] = [
  { label: "Inicio", href: "/admin", icon: Home },
  { label: "Usuarios", href: "/admin/users", icon: User },
  { label: "Referencias Legales", href: "/admin/legal", icon: BookOpen },
  { label: "Categoría", href: "/admin/category-management", icon: Tag },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const isAdmin = true;
  return (
    <nav className="flex flex-col gap-1 p-4 pt-6">
      {isAdmin ? (
        <>
          {adminNav.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-[#07172D] text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-[#07172D]",
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </>
      ) : (
        <>
          <>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-[#07172D] text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-[#07172D]",
                  )}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </>
        </>
      )}
    </nav>
  );
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 min-h-full bg-white border-r border-gray-200 shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed top-0 left-0 h-full w-64 bg-white z-50 lg:hidden border-r border-gray-200 shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-gray-200">
                <div className="flex items-center gap-2 px-4 h-16 ">
                  <div className="w-8 h-8 rounded-md bg-[#07172D] flex items-center justify-center">
                    <span className="text-white font-bold text-xs">R</span>
                  </div>
                  <span className="font-semibold text-[#07172D] text-sm">
                    RedactAI
                  </span>
                </div>
                {onClose && (
                  <Button
                    variant={"ghost"}
                    onClick={onClose}
                    className="lg:hidde p-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </Button>
                )}
              </div>
              <SidebarContent onClose={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
