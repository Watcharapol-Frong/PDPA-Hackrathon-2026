"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** นาฬิกานับถอยหลังขนาดเล็กสำหรับใช้ในแถวตาราง */
export function LiveCountdown({
  startSeconds,
  paused = false,
  className,
}: {
  startSeconds: number;
  paused?: boolean;
  className?: string;
}) {
  const [remaining, setRemaining] = useState(startSeconds);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, [paused]);

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
        critical && !paused ? "text-destructive" : "text-foreground",
        className,
      )}
    >
      {pad(h)}:{pad(m)}:{pad(s)}
    </span>
  );
}
