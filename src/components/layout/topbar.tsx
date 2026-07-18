"use client";

import { useState } from "react";
import { Bell, Menu, PanelLeftClose, PanelLeftOpen, Megaphone, Zap, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SidebarNavContent } from "./sidebar-nav";
import { useTranslation } from "@/lib/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TopbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  alertActive: boolean;
  guardEnabled: boolean;
  onQuickAction: () => void;
}

export function Topbar({
  sidebarOpen,
  setSidebarOpen,
  alertActive,
  guardEnabled,
  onQuickAction,
}: TopbarProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [alertDrawerOpen, setAlertDrawerOpen] = useState(false);
  const { language, setLanguage, t } = useTranslation();

  return (
    <header className="h-14 sm:h-16 shrink-0 border-b bg-card/80 backdrop-blur-md flex items-center justify-between gap-2 px-3 sm:px-6 sticky top-0 z-40">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile nav trigger */}
        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden shrink-0" aria-label={t("openNav")}>
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 flex flex-col">
            <SheetHeader className="h-16 flex-row items-center px-5 border-b space-y-0">
              <SheetTitle className="font-mono text-xs tracking-wider text-muted-foreground uppercase font-bold">
                {t("appTitle")}
              </SheetTitle>
            </SheetHeader>
            <SidebarNavContent onNavigate={() => setMobileNavOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Desktop sidebar toggle button */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:flex shrink-0 text-muted-foreground hover:text-foreground"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? t("closeSidebar") : t("openSidebar")}
        >
          {sidebarOpen ? (
            <PanelLeftClose className="size-5" />
          ) : (
            <PanelLeftOpen className="size-5" />
          )}
        </Button>

        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center font-extrabold text-primary text-xs sm:text-sm shrink-0">
          SC
        </div>
        <div className="min-w-0">
          <div className="text-xs sm:text-sm font-bold truncate">{t("companyName")}</div>
          <div className="text-[10px] sm:text-[11px] text-muted-foreground font-mono truncate">
            {t("gatewayType")}
          </div>
        </div>
      </div>

      {/* Centered DEMO Indicator */}
      <div className="hidden md:flex items-center justify-center">
        <span className="bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-500/20 px-3 py-1 rounded-full font-mono text-[10px] font-extrabold uppercase tracking-widest animate-pulse">
          {language === "en" ? "⚠️ DEMO ONLY — Simulated Environment" : "⚠️ ระบบจำลอง — ชุดข้อมูลทดสอบเท่านั้น"}
        </span>
      </div>

      <div className="flex items-center gap-1 sm:gap-4 shrink-0">
        <span className="hidden xl:flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-success animate-pulse" />
          {t("lastUpdated")}
        </span>

        {/* Single Notification Center Button & Drawer */}
        <Sheet open={alertDrawerOpen} onOpenChange={setAlertDrawerOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "relative transition-all duration-300 rounded-lg",
                alertActive && !guardEnabled
                  ? "text-destructive bg-destructive/10 hover:bg-destructive/20 animate-pulse border border-destructive/20"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label={t("notification")}
            >
              <Bell className="size-5" />
              {alertActive && !guardEnabled ? (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive animate-ping" />
              ) : (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-warning" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 sm:w-96 flex flex-col p-0">
            <SheetHeader className="h-16 flex-row items-center px-6 border-b space-y-0 shrink-0">
              <div className="flex items-center gap-2">
                <Bell className="size-5 text-primary" />
                <SheetTitle className="font-extrabold text-sm uppercase tracking-wider">
                  {t("notifTitle")}
                </SheetTitle>
              </div>
            </SheetHeader>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* 1. สคส. Urgent Broadcast Section */}
              {alertActive && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Megaphone className="size-4 text-destructive animate-pulse" />
                    <span className="font-bold text-xs uppercase text-destructive tracking-wider">
                      {t("notifSectionBroadcast")}
                    </span>
                    <Badge className="ml-auto bg-destructive text-destructive-foreground hover:bg-destructive font-mono text-[9px] h-4.5 py-0 px-1 font-semibold leading-none">
                      CRITICAL
                    </Badge>
                  </div>
                  
                  <div className="p-4 bg-destructive/5 rounded-xl border border-destructive/10 space-y-3 text-left">
                    <p className="text-xs text-foreground leading-relaxed font-medium">
                      {t("alertDetail")}
                    </p>
                    <div>
                      {guardEnabled ? (
                        <div className="flex items-center justify-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-800 text-[10px] font-bold py-1.5 rounded-lg">
                          <CheckCircle2 className="size-3.5 text-blue-600" />
                          <span>{t("guardEnabledMsg")}</span>
                        </div>
                      ) : (
                        <Button
                          onClick={() => {
                            onQuickAction();
                            setAlertDrawerOpen(false);
                          }}
                          className="w-full bg-destructive hover:bg-destructive/90 text-white font-bold h-8 text-[11px] cursor-pointer"
                        >
                          <Zap className="size-3" />
                          <span>{t("enableGuardBtn")}</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. System Notifications Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs uppercase text-muted-foreground tracking-wider">
                    {t("notifSectionGeneral")}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="p-3 bg-muted/40 rounded-xl border border-muted-300 text-left space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground">
                      <span className="bg-emerald-500/10 text-emerald-600 px-1 rounded font-bold uppercase text-[9px]">Success</span>
                      <span>10m ago</span>
                    </div>
                    <p className="text-xs text-foreground font-medium">
                      {t("notifMsg1")}
                    </p>
                  </div>

                  <div className="p-3 bg-muted/40 rounded-xl border border-muted-300 text-left space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground">
                      <span className="bg-blue-500/10 text-blue-600 px-1 rounded font-bold uppercase text-[9px]">Auth</span>
                      <span>1h ago</span>
                    </div>
                    <p className="text-xs text-foreground font-medium">
                      {t("notifMsg2")}
                    </p>
                  </div>

                  <div className="p-3 bg-muted/40 rounded-xl border border-muted-300 text-left space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground">
                      <span className="bg-amber-500/10 text-amber-600 px-1 rounded font-bold uppercase text-[9px]">Info</span>
                      <span>4h ago</span>
                    </div>
                    <p className="text-xs text-foreground font-medium">
                      {t("notifMsg3")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Language switch button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLanguage(language === "en" ? "th" : "en")}
          className="h-8 w-8 font-mono text-xs font-bold border border-muted-foreground/15 hover:bg-accent rounded-lg shrink-0 flex items-center justify-center text-muted-foreground hover:text-foreground"
          aria-label={language === "en" ? "Switch to Thai" : "Switch to English"}
        >
          {language === "en" ? "TH" : "EN"}
        </Button>
      </div>
    </header>
  );
}
