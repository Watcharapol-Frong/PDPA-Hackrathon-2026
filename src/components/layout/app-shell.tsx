"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

interface AppShellProps {
  children: ReactNode;
  alertActive?: boolean;
  guardEnabled?: boolean;
  onQuickAction?: () => void;
}

/** โครงหน้าจอร่วมของทุกหน้า — ถือ state การพับ sidebar ไว้ที่นี่ */
export function AppShell({
  children,
  alertActive = true,
  guardEnabled = false,
  onQuickAction = () => {},
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          alertActive={alertActive}
          guardEnabled={guardEnabled}
          onQuickAction={onQuickAction}
        />
        {children}
      </div>
    </div>
  );
}
