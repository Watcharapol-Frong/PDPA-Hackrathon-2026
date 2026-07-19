"use client";

import { useEffect, useState } from "react";
import { FULL_WINDOW_SECONDS } from "@/lib/AppStateContext";
import { cn } from "@/lib/utils";

/** นาฬิกานับถอยหลังขนาดเล็กสำหรับใช้ในแถวตาราง */
export function LiveCountdown({
  startSeconds,
  paused = false,
  notStarted = false,
  deadlineAt = null,
  className,
}: {
  startSeconds: number;
  paused?: boolean;
  /** ยังไม่ได้บันทึกเวลาทราบเหตุ — แสดงกรอบเต็ม 72 ชม. แบบหยุดนิ่ง */
  notStarted?: boolean;
  /** เวลาหมดเขตจริง (epoch ms) — ใช้แทนการนับเองเพื่อไม่ให้รีเซ็ตตอนสลับหน้า */
  deadlineAt?: number | null;
  className?: string;
}) {
  const [remaining, setRemaining] = useState(() =>
    notStarted ? FULL_WINDOW_SECONDS : startSeconds,
  );

  useEffect(() => {
    if (notStarted) {
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
    if (paused) return;
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [paused, notStarted, deadlineAt]);

  const pad = (n: number) => n.toString().padStart(2, "0");
  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;

  // เหลือน้อยกว่า 12 ชม. ถือว่าวิกฤต
  const critical = remaining < 12 * 3600;

  return (
    <span
      className={cn(
        "font-mono font-bold tabular-nums",
        notStarted
          ? "text-muted-foreground/50"
          : critical && !paused
            ? "text-destructive"
            : "text-foreground",
        className,
      )}
    >
      {pad(h)}:{pad(m)}:{pad(s)}
    </span>
  );
}
