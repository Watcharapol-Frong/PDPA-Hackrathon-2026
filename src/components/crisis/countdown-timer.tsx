"use client";

import { useEffect, useState } from "react";
import { Clock, Hourglass, PlayCircle, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/lib/LanguageContext";
import { FULL_WINDOW_SECONDS } from "@/lib/AppStateContext";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  startSeconds: number;
  /** เมื่อส่งคำร้อง Grace Period แล้ว — หยุดนับและสลับเป็นสถานะสีน้ำเงิน (Action Flow B) */
  gracePending: boolean;
  /**
   * นาฬิกาเริ่มเดินต่อเมื่อ DPO บันทึกเวลาที่ทราบเหตุแล้วเท่านั้น (Technical Spec ข้อ 6)
   * ก่อนหน้านั้นถือว่ายังไม่เข้ากรอบเวลากฎหมาย
   */
  awarenessConfirmed?: boolean;
  onConfirmAwareness?: () => void;
  detectedAt?: string;
  /** เวลาหมดเขตจริง (epoch ms) — มีค่าเมื่อกดยืนยันในเซสชันนี้ */
  deadlineAt?: number | null;
}

export function CountdownTimer({
  startSeconds,
  gracePending,
  awarenessConfirmed = true,
  onConfirmAwareness,
  detectedAt,
  deadlineAt = null,
}: CountdownTimerProps) {
  // ยังไม่ยืนยัน = ยังไม่เสียเวลาไปเลย จึงโชว์กรอบเต็ม 72:00:00
  const [remaining, setRemaining] = useState(() =>
    awarenessConfirmed ? startSeconds : FULL_WINDOW_SECONDS,
  );
  const { t } = useTranslation();

  useEffect(() => {
    if (!awarenessConfirmed) {
      setRemaining(FULL_WINDOW_SECONDS);
      return;
    }
    const tick = () =>
      setRemaining(
        deadlineAt !== null
          ? Math.max(0, Math.floor((deadlineAt - Date.now()) / 1000))
          : (r) => Math.max(0, r - 1),
      );
    if (deadlineAt !== null) tick();
    // หยุดนับตอนรอ สคส. พิจารณาขยายเวลา
    if (gracePending) return;
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [gracePending, awarenessConfirmed, deadlineAt]);

  const pad = (n: number) => n.toString().padStart(2, "0");
  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;

  if (!awarenessConfirmed) {
    return (
      <Card size="sm" className="h-full border border-border bg-card shadow-sm">
        <CardContent className="h-full flex flex-col items-center justify-center text-center gap-2.5 py-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Hourglass className="size-4 shrink-0" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {t("countdownNotStarted")}
            </span>
          </div>

          <div className="font-mono text-3xl sm:text-4xl font-bold text-muted-foreground/50 tabular-nums tracking-tight">
            {pad(h)}:{pad(m)}:{pad(s)}
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed max-w-xs">
            {t("countdownNotStartedSub")}
          </p>

          {detectedAt && (
            <div className="text-[10px] font-mono text-muted-foreground/70">
              {t("countdownDetectedAtLabel")} {detectedAt}
            </div>
          )}

          {onConfirmAwareness && (
            <Button
              onClick={onConfirmAwareness}
              size="sm"
              className="mt-1 font-bold text-xs h-9 bg-destructive hover:bg-destructive/90 text-white"
            >
              <PlayCircle className="size-3.5" />
              {t("countdownConfirmBtn")}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

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
