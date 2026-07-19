"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowRight, ShieldCheck, Siren } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LiveCountdown } from "./live-countdown";
import { useTranslation } from "@/lib/LanguageContext";
import { useAppState } from "@/lib/AppStateContext";
import type { IncidentData, IncidentSeverity, IncidentStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const severityMeta: Record<
  IncidentSeverity,
  { labelKey: "severityHighRisk" | "severityRiskPresent"; noteKey: "severityHighRiskNote" | "severityRiskPresentNote"; className: string }
> = {
  high_risk: {
    labelKey: "severityHighRisk",
    noteKey: "severityHighRiskNote",
    className: "bg-destructive text-destructive-foreground hover:bg-destructive",
  },
  risk_present: {
    labelKey: "severityRiskPresent",
    noteKey: "severityRiskPresentNote",
    className: "bg-brand-warning text-white hover:bg-brand-warning",
  },
};

const statusMeta: Record<
  IncidentStatus,
  { labelKey: "statusAwaitingReview" | "statusInProgress" | "statusGraceRequested"; className: string }
> = {
  awaiting_review: { labelKey: "statusAwaitingReview", className: "bg-muted text-muted-foreground" },
  in_progress: { labelKey: "statusInProgress", className: "bg-primary/10 text-primary" },
  grace_requested: { labelKey: "statusGraceRequested", className: "bg-blue-100 text-blue-800" },
};

export function IncidentList({ incidents }: { incidents: IncidentData[] }) {
  const { t, language } = useTranslation();
  const router = useRouter();
  const { isNewCase, markCaseViewed, isAwarenessConfirmed } = useAppState();

  // Triage Logic ตาม spec — เคสที่เหลือเวลาน้อยที่สุดอยู่บนสุดเสมอ
  const sorted = [...incidents].sort((a, b) => a.remainingSeconds - b.remainingSeconds);
  const locale = language === "th" ? "th-TH" : "en-US";

  if (sorted.length === 0) {
    return (
      <Card size="sm">
        <CardContent className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <ShieldCheck className="size-8 text-brand-success" />
          <p className="font-semibold text-sm">{t("incidentListEmpty")}</p>
          <p className="text-xs text-muted-foreground">{t("incidentListEmptySub")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {/* แถบเตือนจำนวนเคสที่ต้องดำเนินการ */}
      <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2">
        <AlertTriangle className="size-3.5 text-destructive shrink-0" />
        <span className="text-[11px] font-semibold text-destructive">
          {t("incidentUrgentBanner").replace("{count}", String(sorted.length))}
        </span>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="px-4 py-3.5 border-b">
          <h2 className="text-sm font-semibold tracking-tight flex items-center gap-1.5 text-foreground">
            <Siren className="size-4 text-destructive shrink-0" />
            {t("incidentListTitle")}
          </h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {t("incidentListSub")}
          </p>
        </div>

        <div className="px-0 pt-0">
          {/* ตารางเลื่อนแนวนอนได้บนจอเล็ก ไม่ดันหน้าให้ล้น */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-transparent hover:bg-transparent">
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 pl-4">
                    {t("incidentColCase")}
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                    {t("incidentColSeverity")}
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                    {t("incidentColImpact")}
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                    {t("incidentColDetected")}
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                    {t("incidentColRemaining")}
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                    {t("incidentColStatus")}
                  </TableHead>
                  <TableHead className="pr-4" />
                </TableRow>
              </TableHeader>

              <TableBody>
                {sorted.map((inc, i) => {
                  const sev = severityMeta[inc.severity];
                  const st = statusMeta[inc.status];
                  const href = `/crisis-room/${inc.caseId}`;
                  const isMostUrgent = i === 0;
                  const isNew = isNewCase(inc.caseId);
                  const notStarted = !isAwarenessConfirmed(inc.caseId);
                  const open = () => {
                    markCaseViewed(inc.caseId);
                    router.push(href);
                  };

                  return (
                    <TableRow
                      key={inc.caseId}
                      onClick={open}
                      tabIndex={0}
                      aria-label={`${t("incidentOpenAction")} ${inc.caseId}`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          open();
                        }
                      }}
                      className={cn(
                        "cursor-pointer focus-visible:outline-2 focus-visible:outline-destructive",
                        isMostUrgent && "bg-destructive/5 hover:bg-destructive/10",
                        isNew && "border-l-2 border-l-primary",
                      )}
                    >
                      <TableCell className="pl-4 max-w-[260px] align-top py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-semibold">{inc.caseId}</span>
                          {isNew && (
                            <Badge
                              aria-label={t("caseNewAria")}
                              className="bg-primary text-primary-foreground hover:bg-primary text-[9px] font-bold h-4 py-0 px-1 animate-pulse"
                            >
                              {t("caseNewBadge")}
                            </Badge>
                          )}
                        </div>
                        <div className="text-[11px] text-muted-foreground leading-snug mt-0.5">
                          {t(inc.titleKey)}
                        </div>
                      </TableCell>

                      <TableCell className="whitespace-nowrap align-top py-3">
                        <Badge className={cn("text-[9px] font-bold h-4.5 py-0 px-1.5", sev.className)}>
                          {t(sev.labelKey)}
                        </Badge>
                        <div className="text-[10px] text-muted-foreground mt-1 leading-tight">
                          {t(sev.noteKey)}
                        </div>
                      </TableCell>

                      <TableCell className="whitespace-nowrap align-top py-3">
                        <span className="text-xs font-semibold tabular-nums">
                          {inc.affectedRows.toLocaleString(locale)}
                        </span>
                        <span className="text-[10px] text-muted-foreground ml-1">
                          {t("blastRowsUnit")}
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1 max-w-[180px]">
                          {inc.compromisedFields.slice(0, 2).map((f) => (
                            <Badge
                              key={f.id}
                              variant="secondary"
                              className="text-[9px] h-4 py-0 px-1 font-normal"
                            >
                              {t(f.labelKey)}
                            </Badge>
                          ))}
                          {inc.compromisedFields.length > 2 && (
                            <span className="text-[9px] text-muted-foreground">
                              +{inc.compromisedFields.length - 2}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="font-mono text-[10px] text-muted-foreground whitespace-nowrap align-top py-3">
                        {inc.detectedAt}
                      </TableCell>

                      <TableCell className="whitespace-nowrap align-top py-3">
                        <LiveCountdown
                          startSeconds={inc.remainingSeconds}
                          paused={inc.status === "grace_requested"}
                          notStarted={notStarted}
                          className="text-sm"
                        />
                        {notStarted && (
                          <div className="text-[9px] text-muted-foreground mt-0.5">
                            {t("countdownAwaitingShort")}
                          </div>
                        )}
                        {inc.status === "grace_requested" && (
                          <div className="text-[9px] text-blue-700 font-semibold mt-0.5">+24h</div>
                        )}
                      </TableCell>

                      <TableCell className="whitespace-nowrap align-top py-3">
                        <span
                          className={cn(
                            "inline-block rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
                            st.className,
                          )}
                        >
                          {t(st.labelKey)}
                        </span>
                      </TableCell>

                      <TableCell className="pr-4 text-right align-top py-3">
                        <Button variant="ghost" size="sm" className="text-xs h-7" tabIndex={-1}>
                          {t("incidentOpenAction")}
                          <ArrowRight className="size-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground px-0.5">{t("incidentSortNote")}</p>
    </div>
  );
}
