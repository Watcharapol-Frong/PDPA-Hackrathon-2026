"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileClock, LayoutDashboard, Radar, Settings, Siren, LogOut, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/LanguageContext";
import { useAppState } from "@/lib/AppStateContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const menuItems = [
  { id: "overview", href: "/", labelKey: "menuOverview", subKey: "menuOverviewSub", icon: LayoutDashboard },
  { id: "incident", href: "/crisis-room", labelKey: "menuIncident", subKey: "menuIncidentSub", icon: Siren },
  { id: "audit", href: "/audit-log", labelKey: "menuAudit", subKey: "menuAuditSub", icon: FileClock },
  { id: "threat", href: "/threat-analytics", labelKey: "menuThreat", subKey: "menuThreatSub", icon: Radar },
] as const;

export const settingsItem = {
  id: "settings",
  href: "/settings",
  labelKey: "menuSettings",
  subKey: "menuSettingsSub",
  icon: Settings,
} as const;

interface NavLinkProps {
  href: string;
  label: string;
  sub: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  active?: boolean;
  onClick?: () => void;
  isOpen?: boolean;
  /** แสดงจุดแดงเตือนเมื่อมีเหตุวิกฤตค้างอยู่ */
  alert?: boolean;
  /** จำนวนเคสใหม่ที่ยังไม่เคยเปิด — 0 = ไม่แสดง */
  badgeCount?: number;
}

export function NavLink({
  href,
  label,
  sub,
  icon: Icon,
  active = false,
  onClick,
  isOpen = true,
  alert = false,
  badgeCount = 0,
}: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "relative w-full flex items-center rounded-xl text-left transition min-h-11",
        isOpen ? "items-start gap-3 px-3 py-2.5" : "justify-center p-2.5",
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
      title={!isOpen ? label : undefined}
    >
      <span className="relative shrink-0">
        <Icon size={18} className={cn("shrink-0", isOpen && "mt-0.5")} />
        {alert && (
          <span className="absolute -top-0.5 -right-0.5 flex size-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75 animate-ping" />
            <span className="relative inline-flex size-2 rounded-full bg-destructive" />
          </span>
        )}
      </span>
      {isOpen && (
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5 text-sm font-semibold leading-tight">
            {label}
            {badgeCount > 0 && (
              <span className="shrink-0 rounded-full bg-primary text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 leading-none">
                {badgeCount}
              </span>
            )}
          </span>
          <span
            className={cn(
              "block text-[10px] font-mono mt-0.5",
              active ? "text-primary/70" : "text-muted-foreground/70",
            )}
          >
            {sub}
          </span>
        </span>
      )}
    </Link>
  );
}

export function SidebarNavContent({
  onNavigate,
  isOpen = true,
}: {
  onNavigate?: () => void;
  isOpen?: boolean;
}) {
  const { t } = useTranslation();
  const pathname = usePathname();
  // จุดแดงเตือนขึ้นเฉพาะตอนมีเหตุค้างจริง ปิดคดีแล้วต้องหายไป
  const { incident, newCaseCount } = useAppState();

  return (
    <div className="flex flex-col h-full w-full">
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.id}
            href={item.href}
            label={t(item.labelKey)}
            sub={t(item.subKey)}
            icon={item.icon}
            active={pathname === item.href}
            onClick={onNavigate}
            isOpen={isOpen}
            alert={item.id === "incident" && incident !== null}
            badgeCount={item.id === "incident" ? newCaseCount : 0}
          />
        ))}
      </nav>
      <div className="p-3 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "w-full flex items-center rounded-xl text-left transition min-h-11 hover:bg-muted text-foreground cursor-pointer focus:outline-none",
                isOpen ? "justify-between gap-3 px-3 py-2" : "justify-center p-2.5",
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-extrabold text-primary text-xs shrink-0">
                  NK
                </div>
                {isOpen && (
                  <div className="min-w-0">
                    <span className="block text-xs font-bold leading-tight truncate">
                      {t("userName")}
                    </span>
                    <span className="block text-[10px] text-muted-foreground font-mono mt-0.5 leading-none">
                      DPO Portal
                    </span>
                  </div>
                )}
              </div>
              {isOpen && <ChevronsUpDown className="size-3.5 text-muted-foreground shrink-0" />}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isOpen ? "start" : "center"} side="right" className="w-52 mb-2 ml-1">
            <DropdownMenuItem onClick={onNavigate}>
              <Settings className="size-4 text-muted-foreground" />
              <span>{t("menuSettings")}</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogOut className="size-4 text-destructive" />
              <span className="text-destructive font-semibold">{t("logout")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
