"use client";

import { useEffect, useState } from "react";
import { Clock, Hourglass, Scale } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/lib/LanguageContext";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  startSeconds: number;
  /** เมื่อส่งคำร้อง Grace Period แล้ว — หยุดนับและสลับเป็นสถานะสีน้ำเงิน (Action Flow B) */
  gracePending: boolean;
}

export function CountdownTimer({ startSeconds, gracePending }: CountdownTimerProps) {
  const [remaining, setRemaining] = useState(startSeconds);
  const { t } = useTranslation();

  useEffect(() => {
    if (gracePending) return;
    const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, [gracePending]);

  const pad = (n: number) => n.toString().padStart(2, "0");
  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;

  if (gracePending) {
    return (
      <Card size="sm" className="h-full border border-border bg-card shadow-sm">
        <CardContent className="h-full flex flex-col items-center justify-center text-center gap-2.5 py-6">
          <Clock className="size-5 text-blue-600" />
          <div className="font-bold text-foreground text-sm leading-snug">
            {t("countdownGraceTitle")}
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed max-w-sm">
            {t("countdownGraceSub")}
          </p>
          <div className="font-mono text-xl font-bold text-blue-600 mt-1 tabular-nums">
            {pad(h)}:{pad(m)}:{pad(s)}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card size="sm" className="h-full border border-border bg-card shadow-sm">
      <CardContent className="h-full flex flex-col items-center justify-center text-center gap-2 py-6">
        {/* Redundant Encoding (WCAG 2.2): ตัวเลข + ไอคอนนาฬิกาทราย + ข้อความกำกับ */}
        <div className="flex items-center gap-2 text-destructive">
          <Hourglass className="size-4 shrink-0 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            {t("countdownTitle")}
          </span>
        </div>

        <div
          className={cn(
            "font-mono text-3xl sm:text-4xl font-bold text-destructive tabular-nums tracking-tight",
            "animate-pulse",
          )}
          role="timer"
          aria-live="off"
          aria-label={`${t("countdownLabel")} ${h} ${m} ${s}`}
        >
          {pad(h)}:{pad(m)}:{pad(s)}
        </div>

        <p className="text-[11px] font-semibold text-destructive/90 leading-snug max-w-xs">
          {t("countdownLabel")}
        </p>

        <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground mt-0.5">
          <Scale className="size-3 shrink-0" />
          {t("countdownLegalBasis")}
        </div>
      </CardContent>
    </Card>
  );
}
