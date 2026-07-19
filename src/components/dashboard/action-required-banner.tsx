"use client";

import Link from "next/link";
import { ArrowRight, Clock, Siren } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LiveCountdown } from "@/components/crisis/live-countdown";
import { useAppState } from "@/lib/AppStateContext";
import { useTranslation } from "@/lib/LanguageContext";
import { cn } from "@/lib/utils";

/**
 * Action Required Banner (Design Spec 5.2)
 * แถบค้างที่ปิดไม่ได้ตราบใดที่ยังมีเหตุต้องรายงาน — เป็นทางเดียวที่ DPO
 * จะเห็นจากหน้าแรกว่ามีคดีค้างและเหลือเวลาเท่าไหร่
 */
export function ActionRequiredBanner() {
  const { incidents, isGracePending, isNewCase, markCaseViewed, isAwarenessConfirmed, deadlineFor } = useAppState();
  const { t } = useTranslation();

  if (incidents.length === 0) return null;

  const hasHighRisk = incidents.some((i) => i.severity === "high_risk");
  const countLabel =
    incidents.length === 1
      ? t("actionRequiredOne")
      : t("actionRequiredMany").replace("{count}", String(incidents.length));

  return (
    <section
      className={cn(
        "rounded-xl border-2 overflow-hidden",
        hasHighRisk ? "border-destructive/40 bg-destructive/5" : "border-brand-warning/40 bg-brand-warning/5",
      )}
      aria-live="polite"
    >
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-inherit">
        <span className="relative flex size-2.5 shrink-0">
          <span
            className={cn(
              "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
              hasHighRisk ? "bg-destructive" : "bg-brand-warning",
            )}
          />
          <span
            className={cn(
              "relative inline-flex size-2.5 rounded-full",
              hasHighRisk ? "bg-destructive" : "bg-brand-warning",
            )}
          />
        </span>
        <Siren className={cn("size-4 shrink-0", hasHighRisk ? "text-destructive" : "text-brand-warning")} />
        <span
          className={cn(
            "text-xs font-extrabold uppercase tracking-wide",
            hasHighRisk ? "text-destructive" : "text-brand-warning",
          )}
        >
          {t("actionRequiredTitle")}
        </span>
        <span className="text-[11px] text-muted-foreground ml-auto hidden sm:block">{countLabel}</span>
      </div>

      <ul className="divide-y divide-inherit">
        {incidents.map((inc) => {
          const high = inc.severity === "high_risk";
          const held = isGracePending(inc.caseId);
          const isNew = isNewCase(inc.caseId);
          const notStarted = !isAwarenessConfirmed(inc.caseId);
          return (
            <li
              key={inc.caseId}
              className={cn(
                "flex flex-col gap-2 px-4 py-2.5 sm:flex-row sm:items-center sm:gap-4",
                isNew && "bg-primary/5 border-l-2 border-l-primary",
              )}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold">{inc.caseId}</span>
                  {isNew && (
                    <Badge
                      aria-label={t("caseNewAria")}
                      className="bg-primary text-primary-foreground hover:bg-primary text-[9px] font-bold h-4.5 py-0 px-1.5 animate-pulse"
                    >
                      {t("caseNewBadge")}
                    </Badge>
                  )}
                  <Badge
                    className={cn(
                      "text-[9px] font-bold h-4.5 py-0 px-1.5",
                      high
                        ? "bg-destructive text-destructive-foreground hover:bg-destructive"
                        : "bg-brand-warning text-white hover:bg-brand-warning",
                    )}
                  >
                    {high ? t("severityHighRisk") : t("severityRiskPresent")}
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                  {t(inc.titleKey)}
                </p>
                <p className="text-[10px] text-muted-foreground/80 mt-0.5">
                  {high ? t("actionRequiredNotifyBoth") : t("actionRequiredNotifyPdpc")}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="text-[9px] uppercase tracking-wider text-muted-foreground">
                    {notStarted
                      ? t("countdownAwaitingShort")
                      : held
                        ? t("actionRequiredGraceHeld")
                        : t("actionRequiredRemaining")}
                  </div>
                  <LiveCountdown
                    startSeconds={inc.remainingSeconds}
                    paused={held}
                    notStarted={notStarted}
                    deadlineAt={deadlineFor(inc.caseId)}
                    className="text-sm"
                  />
                </div>
                <Button asChild size="sm" variant={high ? "default" : "outline"} className="text-xs h-8">
                  <Link
                    href={`/crisis-room/${encodeURIComponent(inc.caseId)}`}
                    onClick={() => markCaseViewed(inc.caseId)}
                  >
                    {t("actionRequiredOpen")}
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="flex items-center gap-1.5 px-4 py-2 border-t border-inherit">
        <Clock className="size-3 text-muted-foreground shrink-0" />
        <span className="text-[10px] text-muted-foreground">
          {t("countdownLegalBasis")}
        </span>
      </div>
    </section>
  );
}
