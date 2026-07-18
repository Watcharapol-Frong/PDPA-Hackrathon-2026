"use client";

import Link from "next/link";
import { ArrowLeft, Siren } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { IncidentList } from "@/components/crisis/incident-list";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/LanguageContext";
import { useAppState } from "@/lib/AppStateContext";

export default function CrisisRoomListPage() {
  const { t } = useTranslation();
  // เหตุที่ยังไม่ปิดเท่านั้น — ปิดคดีแล้วรายการจะหายไปเองทุกหน้า
  const { incidents: liveIncidents, isGracePending } = useAppState();
  // สถานะในตารางต้องสะท้อน action ที่เพิ่งทำในหน้ารายละเอียด ไม่ใช่ค่าตั้งต้น
  const incidents = liveIncidents.map((i) =>
    isGracePending(i.caseId) ? { ...i, status: "grace_requested" as const } : i,
  );

  return (
    <AppShell alertActive guardEnabled={false}>
      <main className="flex-1 p-4 sm:p-6 space-y-4 max-w-[1400px] w-full mx-auto">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight flex items-center gap-1.5">
              <Siren className="size-5 text-destructive shrink-0" />
              {t("crisisPageTitle")}
            </h1>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">{t("crisisPageSub")}</p>
          </div>
        </div>

        <IncidentList incidents={incidents} />
      </main>
    </AppShell>
  );
}
