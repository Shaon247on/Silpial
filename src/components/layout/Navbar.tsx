"use client";

import { LogOut, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { logoutAction } from "@/actions/auth.actions";
import Logo from "../elements/Logo";

interface NavbarProps {
  is_admin: boolean;
  image: string;
  onMenuToggle?: () => void;
}

export default function Navbar({
  onMenuToggle,
  is_admin,
  image = "",
}: NavbarProps) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 z-50 sticky top-0"
    >
      {/* Left: Logo + Office Title */}
      <div className="flex items-center gap-3 md:gap-4">
        <button
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          onClick={onMenuToggle}
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>

        <Logo />
      </div>

      {/* Right: User + Logout */}
      <div className="flex items-center gap-3">
        <Link href={is_admin ? "/admin/profile" : "/dashboard/profile"}>
          <Avatar className="cursor-pointer">
            {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
            <AvatarImage
              src={image === "" ? "https://github.com/shadcn.png" : image}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <Link href={"/"}>
          <Button
            onClick={logoutAction}
            variant={"ghost"}
            className="flex items-center gap-2 text-sm font-medium text-[#07172D] hover:text-red-400 duration-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </Button>
        </Link>
      </div>
    </motion.header>
  );
}
