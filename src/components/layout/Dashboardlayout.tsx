"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  is_admin: boolean;
}

const SIDEBAR_WIDTH = 224; // w-56
const NAVBAR_HEIGHT = 64; // h-16

export default function DashboardLayout({
  children,
  is_admin,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Navbar onMenuToggle={() => setSidebarOpen(true)} />

      {/* Fixed desktop sidebar */}
      <div
        className="fixed left-0 z-30 hidden lg:block border-r border-gray-200 bg-white"
        style={{
          top: `${NAVBAR_HEIGHT}px`,
          width: `${SIDEBAR_WIDTH}px`,
          height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
        }}
      >
        <Sidebar
          isOpen={false}
          onClose={() => setSidebarOpen(false)}
          is_admin={is_admin}
        />
      </div>

      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          is_admin={is_admin}
        />
      </div>

      {/* Main content */}
      <main
        className="bg-gray-50 p-3 md:p-8"
      >
        <div
          className="min-h-[calc(100vh-64px)]"
          style={{
            marginLeft: typeof window === "undefined" ? undefined : undefined,
          }}
        >
          <div className="lg:ml-56">{children}</div>
        </div>
      </main>
    </div>
  );
}