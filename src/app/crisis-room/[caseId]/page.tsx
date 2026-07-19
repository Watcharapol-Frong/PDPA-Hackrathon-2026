"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { AlertCircle, ArrowLeft, Siren, Clock, FileText } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { CountdownTimer } from "@/components/crisis/countdown-timer";
import { BlastRadius } from "@/components/crisis/blast-radius";
import { AttackTimeline } from "@/components/crisis/attack-timeline";
import { AttackVectorGraph } from "@/components/crisis/attack-vector-graph";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/lib/LanguageContext";
import { useAppState } from "@/lib/AppStateContext";

export default function IncidentDetailPage() {
  const params = useParams<{ caseId: string }>();
  // Action Flow B — สถานะขอขยายเวลาอยู่ใน store กลาง หน้าอื่นจึงเห็นผลทันที
  const { getIncident, isGracePending, isAwarenessConfirmed, confirmAwareness, deadlineFor } =
    useAppState();
  const caseId = decodeURIComponent(params.caseId);
  const incident = getIncident(caseId);
  const gracePending = isGracePending(caseId);
  const { t } = useTranslation();

  if (!incident) {
    return (
      <AppShell alertActive guardEnabled={false}>
        <main className="flex-1 p-4 sm:p-6 max-w-[1400px] w-full mx-auto">
          <Card size="sm">
            <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <AlertCircle className="size-8 text-muted-foreground" />
              <p className="font-semibold text-sm">{t("incidentNotFound")}</p>
              <p className="text-xs text-muted-foreground">{t("incidentNotFoundSub")}</p>
              <Button asChild variant="outline" size="sm" className="mt-1 text-xs h-8">
                <Link href="/crisis-room">
                  <ArrowLeft className="size-3.5" />
                  {t("crisisBackToList")}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </AppShell>
    );
  }

  return (
    <AppShell alertActive guardEnabled={false}>
      <main className="flex-1 p-4 sm:p-6 space-y-5 max-w-[1400px] w-full mx-auto">
        {/* Page header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight flex items-center gap-1.5 text-foreground">
              <Siren className="size-5 text-destructive shrink-0" />
              {t("crisisPageTitle")}
            </h1>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">
              {t(incident.titleKey)}
            </p>
          </div>

          <Button asChild variant="outline" size="sm" className="shrink-0 text-xs h-8">
            <Link href="/crisis-room">
              <ArrowLeft className="size-3.5" />
              {t("crisisBackToList")}
            </Link>
          </Button>
        </div>

        {/* Section 1 — Problem & Scope Assessment (Consolidated Metadata inside BlastRadius) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
          <div className="lg:col-span-4">
            <CountdownTimer
              startSeconds={incident.remainingSeconds}
              gracePending={gracePending}
              awarenessConfirmed={isAwarenessConfirmed(caseId)}
              onConfirmAwareness={() => confirmAwareness(caseId)}
              detectedAt={incident.detectedAt}
              deadlineAt={deadlineFor(caseId)}
            />
          </div>
          <div className="lg:col-span-8">
            <BlastRadius
              caseId={incident.caseId}
              detectedAt={incident.detectedAt}
              severity={incident.severity}
              affectedRows={incident.affectedRows}
              fields={incident.compromisedFields}
            />
          </div>
        </div>

        {/* Section 2 — Root Cause Analysis & Investigation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
          <div className="lg:col-span-4">
            <AttackTimeline events={incident.timeline} />
          </div>
          <div className="lg:col-span-8">
            <AttackVectorGraph
              nodes={incident.nodes}
              edges={incident.edges}
              summaryKey={incident.aiSummaryKey}
            />
          </div>
        </div>

        {/* Section 3 — Phased Actions Panel */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-5 border-t">
          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto h-9 px-4 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5"
          >
            <Link href={`/crisis-room/${encodeURIComponent(incident.caseId)}/grace-workspace`}>
              <Clock className="size-3.5 text-amber-500" />
              <span>{gracePending ? t("graceAlreadySent") : t("btnRequestGrace")}</span>
            </Link>
          </Button>
          <Button
            asChild
            className="w-full sm:w-auto h-9 px-4 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5"
          >
            <Link href={`/crisis-room/${encodeURIComponent(incident.caseId)}/document-workspace`}>
              <FileText className="size-3.5" />
              <span>{t("btnDraftReport")}</span>
            </Link>
          </Button>
        </div>
      </main>
    </AppShell>
  );
}
