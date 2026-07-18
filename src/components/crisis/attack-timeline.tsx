"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/lib/LanguageContext";
import type { TimelineEvent } from "@/lib/types";
import { cn } from "@/lib/utils";

const dotStyles: Record<TimelineEvent["severity"], string> = {
  info: "bg-muted-foreground/40 border-muted-foreground/40",
  warning: "bg-brand-warning border-brand-warning",
  critical: "bg-destructive border-destructive",
};

export function AttackTimeline({ events }: { events: TimelineEvent[] }) {
  const { t } = useTranslation();

  return (
    <Card size="sm" className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold tracking-tight">{t("timelineTitle")}</CardTitle>
        <CardDescription className="text-[11px] text-muted-foreground">
          {t("timelineSub")}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Vertical timeline — Data-Ink Ratio สูง ไม่มี chartjunk */}
        <ol className="relative">
          {events.map((e, i) => {
            const isLast = i === events.length - 1;
            return (
              <li key={e.time} className="relative flex gap-3 pb-4 last:pb-0">
                {/* เส้นแกนตั้ง */}
                {!isLast && (
                  <span
                    className="absolute left-[5px] top-3 bottom-0 w-px bg-border"
                    aria-hidden
                  />
                )}
                <span
                  className={cn(
                    "relative z-10 mt-1 size-2.5 shrink-0 rounded-full border-2",
                    dotStyles[e.severity],
                  )}
                  aria-hidden
                />
                <div className="min-w-0 -mt-0.5">
                  <div className="font-mono text-[11px] font-bold text-muted-foreground">
                    {e.time}
                  </div>
                  <p
                    className={cn(
                      "text-xs leading-snug mt-0.5",
                      e.severity === "critical" ? "text-destructive font-semibold" : "text-foreground",
                    )}
                  >
                    {t(e.labelKey)}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}
