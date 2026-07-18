"use client";

import { cn } from "@/lib/utils";
import { SidebarNavContent } from "./sidebar-nav";

export function Sidebar({ isOpen }: { isOpen: boolean }) {
  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col h-screen sticky top-0 border-r bg-card shrink-0 transition-all duration-300 ease-in-out overflow-hidden",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className={cn("flex flex-col h-full shrink-0", isOpen ? "w-64" : "w-16")}>
        <div className={cn("h-16 flex items-center border-b shrink-0", isOpen ? "px-5" : "justify-center")}>
          {isOpen ? (
            <span className="font-mono text-xs tracking-wider text-muted-foreground uppercase font-bold">
              PDPA Guardian
            </span>
          ) : (
            <span className="font-mono text-xs tracking-wider text-muted-foreground uppercase font-bold">
              PG
            </span>
          )}
        </div>
        <SidebarNavContent isOpen={isOpen} />
      </div>
    </aside>
  );
}
