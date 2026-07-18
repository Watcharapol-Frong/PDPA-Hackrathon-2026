"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Download, FileClock, Lock, ShieldCheck, X } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { EvidenceTable, SealedBadge } from "@/components/evidence/evidence-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppState } from "@/lib/AppStateContext";
import { useTranslation } from "@/lib/LanguageContext";

function AuditLogContent() {
  const { auditLog, policy } = useAppState();
  const { t } = useTranslation();
  const searchParams = useSearchParams();

  // deep-link จากห้องวิกฤต: /audit-log?case=INC-xxxx
  const caseFilter = searchParams.get("case");
  const entries = caseFilter ? auditLog.filter((e) => e.caseId === caseFilter) : auditLog;

  return (
    <main className="flex-1 p-4 sm:p-6 space-y-4 max-w-[1400px] w-full mx-auto">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-extrabold tracking-tight flex items-center gap-1.5">
            <FileClock className="size-5 text-primary shrink-0" />
            {t("evidencePageTitle")}
          </h1>
          <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">
            {t("evidencePageSub")}
          </p>
        </div>

        <Button variant="outline" size="sm" className="shrink-0 text-xs h-8">
          <Download className="size-3.5" />
          {t("evidenceExport")}
        </Button>
      </div>

      {caseFilter && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border bg-muted/50 px-3 py-2">
          <span className="text-xs font-semibold">
            {t("evidenceFilteredByCase").replace("{case}", caseFilter)}
          </span>
          <Button asChild variant="ghost" size="sm" className="h-6 text-[11px] ml-auto">
            <Link href="/audit-log">
              <X className="size-3" />
              {t("evidenceClearFilter")}
            </Link>
          </Button>
        </div>
      )}

      <Card size="sm">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle className="text-sm font-semibold tracking-tight flex items-center gap-1.5">
                <Lock className="size-3.5 text-muted-foreground shrink-0" />
                {t("evidenceEntryCount").replace("{count}", String(entries.length))}
              </CardTitle>
              <CardDescription className="text-[11px] text-muted-foreground mt-0.5">
                Masking {policy.dataMasking ? "ON" : "OFF"} · Throttle{" "}
                {policy.trafficThrottling ? "ON" : "OFF"}
              </CardDescription>
            </div>
            <SealedBadge />
          </div>
        </CardHeader>

        <CardContent className="px-0 pt-0">
          {entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
              <ShieldCheck className="size-8 text-brand-success" />
              <p className="font-semibold text-sm">{t("evidenceEmpty")}</p>
              <p className="text-xs text-muted-foreground">{t("evidenceEmptySub")}</p>
            </div>
          ) : (
            <EvidenceTable entries={entries} />
          )}
        </CardContent>
      </Card>
    </main>
  );
}

export default function AuditLogPage() {
  return (
    <AppShell alertActive guardEnabled={false}>
      {/* useSearchParams ต้องมี Suspense ครอบตอน prerender */}
      <Suspense fallback={<main className="flex-1 p-6" />}>
        <AuditLogContent />
      </Suspense>
    </AppShell>
  );
}
