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
        <div className="flex-1 flex flex-col overflow-y-auto">
          {children}
        </div>
        
        {/* Global Demo Disclaimer Footer */}
        <footer className="border-t bg-card/60 py-2.5 px-4 text-center shrink-0">
          <p className="text-[9px] text-muted-foreground/80 leading-relaxed font-medium">
            Disclaimer: This application is a simulated demonstration portal using generated mock data for PDPA hackathon evaluation only. No real customer data is processed.
            <br />
            หมายเหตุ: ระบบนี้พัฒนาขึ้นเพื่อจำลองการสาธิตและทดสอบเกณฑ์ทางกฎหมายคุ้มครองข้อมูลส่วนบุคคล (PDPA) เท่านั้น ข้อมูลทั้งหมดเป็นชุดข้อมูลทดสอบจำลอง
          </p>
        </footer>
      </div>
    </div>
  );
}
