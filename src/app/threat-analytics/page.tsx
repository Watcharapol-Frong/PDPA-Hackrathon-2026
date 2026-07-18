"use client";

import Link from "next/link";
import { ArrowRight, Fingerprint, Info, Radar, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { AttackVectorGraph } from "@/components/crisis/attack-vector-graph";
import { RiskTelemetryChart } from "@/components/dashboard/risk-telemetry-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppState } from "@/lib/AppStateContext";
import { useTranslation, type TranslationKey } from "@/lib/LanguageContext";

const ioaKeys: TranslationKey[] = [
  "threatIoaEndpoint",
  "threatIoaVelocity",
  "threatIoaPayload",
  "threatIoaHours",
];

export default function ThreatAnalyticsPage() {
  const { incident } = useAppState();
  const { t } = useTranslation();

  return (
    <AppShell alertActive guardEnabled={false}>
      <main className="flex-1 p-4 sm:p-6 space-y-4 max-w-[1400px] w-full mx-auto">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-extrabold tracking-tight flex items-center gap-1.5">
            <Radar className="size-5 text-primary shrink-0" />
            {t("threatPageTitle")}
          </h1>
          <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">{t("threatPageSub")}</p>
        </div>

        {!incident ? (
          <Card size="sm">
            <CardContent className="flex flex-col items-center justify-center gap-2 py-16 text-center">
              <ShieldCheck className="size-8 text-brand-success" />
              <p className="font-semibold text-sm">{t("threatNoIncident")}</p>
              <p className="text-xs text-muted-foreground max-w-md">{t("threatNoIncidentSub")}</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* แคมเปญที่เคสนี้ถูกจัดกลุ่มเข้าไป */}
            <Card size="sm">
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <CardTitle className="text-sm font-semibold tracking-tight flex items-center gap-1.5">
                      <Fingerprint className="size-4 text-destructive shrink-0" />
                      {t("threatActiveCampaign")}
                    </CardTitle>
                    <CardDescription className="text-[11px] text-muted-foreground mt-0.5">
                      {t("threatCampaignName")}
                    </CardDescription>
                  </div>
                  <Button asChild variant="outline" size="sm" className="shrink-0 text-xs h-8">
                    <Link href={`/crisis-room/${encodeURIComponent(incident.caseId)}`}>
                      {t("threatViewIncident")}
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <Stat label={t("threatCampaignId")} value="CMP-TH-2026-0714" mono />
                  <Stat label={t("threatMatchConfidence")} value="92.4%" danger />
                  <Stat label={t("threatPeerOrgs")} value={t("threatPeerOrgsValue")} />
                  <Stat label={t("threatFirstSeen")} value="2026-07-16 21:08" mono />
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
              <div className="lg:col-span-7">
                <RiskTelemetryChart />
              </div>
              <div className="lg:col-span-5">
                <Card size="sm" className="h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold tracking-tight">
                      {t("threatIoaTitle")}
                    </CardTitle>
                    <CardDescription className="text-[11px] text-muted-foreground">
                      {t("threatIoaSub")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2">
                      {ioaKeys.map((key) => (
                        <li key={key} className="flex gap-2 items-start">
                          <span className="mt-1.5 size-1.5 rounded-full bg-destructive shrink-0" />
                          <span className="text-[11px] leading-relaxed">{t(key)}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* ใช้กราฟตัวเดียวกับห้องวิกฤต — เห็นเส้นทางโจมตีเดียวกัน */}
            <AttackVectorGraph
              nodes={incident.nodes}
              edges={incident.edges}
              summaryKey={incident.aiSummaryKey}
            />

            <div className="flex gap-2 rounded-xl border bg-muted/50 p-3">
              <Info className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-[10px] leading-relaxed text-muted-foreground">
                {t("threatPrivacyNote")}
              </p>
            </div>
          </>
        )}
      </main>
    </AppShell>
  );
}

function Stat({
  label,
  value,
  mono = false,
  danger = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="rounded-xl border p-3">
      <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </div>
      <div
        className={`text-xs font-bold mt-1 ${mono ? "font-mono" : ""} ${danger ? "text-destructive" : ""}`}
      >
        {value}
      </div>
    </div>
  );
}
